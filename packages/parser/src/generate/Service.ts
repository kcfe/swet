import { StandardInterface, StandardService, StandardType } from '../types'
import { getPropertyDependenceModel, transformPropertyToCode } from '../utils'

interface ServicePayload {
  service: StandardService
  interfaces: StandardInterface[]
  allModel: { name: string; content: string; description: string; dependence: string[] }[]
}

/**
 * 接口数据构造器
 */
export class Service {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public data: ServicePayload, public config: Record<string, any>) {}

  /**
   * 接口默认代码模版
   */
  public getDefaultServiceCode() {
    const {
      url,
      name,
      method,
      headers,
      queryCode,
      bodyCode,
      payloadCode,
      description,
      responseCode,
      controllerName,
      deprecated,
    } = this.getEachPartCode()

    let content = deprecated
      ? `\n\n/**
            * @deprecated
            * ${controllerName} ${description}
            */\n`
      : `\n\n/** ${controllerName} ${description} */\n`

    content += `export async function ${name}(${payloadCode}) {
      ${queryCode}
      ${bodyCode}
      \nconst result = await axios.request<${responseCode}>({
        url: \`${url}\`,
        method: '${method}',${queryCode ? 'params,' : ''}${bodyCode ? 'data,' : ''}
        headers: ${JSON.stringify(headers, null)}
      })

      return result
    }\n\n`

    return content
  }

  /**
   * 获取组装接口的各部分代码
   */
  public getEachPartCode(model?: string) {
    const {
      service: { path, contentType, response, ...rest },
    } = this.data

    // 将 path 路径参数补充完整
    const url = path.replace(/\{(.+?)\}/g, (_, $1) => `\${payload.${$1}}`)
    // 请求头
    const headers = { 'Content-Type': contentType }
    // 判断是是否是 multipart/form-data 形式入参数
    const isFormData = contentType === 'multipart/form-data'
    // 接口入参信息
    const parametersInfo = this.getParametersInfo(model)

    // 判断是否存在参数
    const hasPayload = parametersInfo.length > 0
    // 判断是否存在 query 入参
    const hasQuery = parametersInfo.find(v => v.in === 'query')
    // 判断是否存在 body 入参
    const hasBody = parametersInfo.find(v => v.in === 'body')
    // 获取所有的 multipart/form-data 形式参数
    const formDataPayload = parametersInfo.filter(v => v.in === 'formData')

    let payloadCode = hasPayload ? `payload: {` : ''
    let queryCode = hasQuery ? `const params = Object.assign({}` : ''
    let bodyCode = hasBody ? `const data = Object.assign({}` : ''

    parametersInfo.forEach(item => {
      const { name, value, required, isObject } = item

      if (item.in === 'query') {
        queryCode += isObject ? `, payload.${name}` : `, {${name}: payload.${name}}`
      }

      if (['body'].includes(item.in) && !isFormData) {
        bodyCode += isObject ? `, payload.${name}` : `, {${name}: payload.${name}}`
      }

      payloadCode += `\n${name}${required ? '' : '?'}: ${value};`
    })

    if (hasPayload) {
      payloadCode += '}'
    }
    if (hasQuery) {
      queryCode += ')'
    }
    if (hasBody) {
      bodyCode += ')'
    }

    if (isFormData) {
      bodyCode = 'const data: any = new FormData();'
      formDataPayload.forEach(({ name }) => {
        bodyCode += `
					data.append('${name}', payload.${name});
					`
      })
    }

    // 只有一个参数，且是对象类型
    if (parametersInfo.length === 1 && parametersInfo[0].isObject) {
      const { in: positionIn, value } = parametersInfo[0]
      payloadCode = `payload?: ${value}`
      positionIn === 'query'
        ? (queryCode = `const params = payload`)
        : (bodyCode = `const data = payload`)

      if (positionIn === 'formData') {
        payloadCode = `payload?: ${value}`
        bodyCode = `const data: any = new FormData();
            for (const key in payload || {}) {
              data.append(key, payload[key])
            }
          `
      }
    }

    // 判断是否都是 queryCode
    const allQuery = parametersInfo.every(v => v.in === 'query')
    // 判断是否都是 bodyCode
    const allBody = parametersInfo.every(v => v.in === 'body')

    if (hasQuery && allQuery) {
      queryCode = `const params = payload`
    }

    if (hasBody && allBody) {
      bodyCode = `const data = payload`
    }

    // 响应 code
    const responseCode = response.length ? transformPropertyToCode(response[0], model) : 'void'

    return { ...rest, url, headers, payloadCode, queryCode, bodyCode, responseCode }
  }

  /**
   * 获取接口的入参信息
   */
  public getParametersInfo(model?: string) {
    const {
      service: { parameters },
    } = this.data

    const info = parameters
      .filter(v => v.name)
      .map(parameter => ({
        in: parameter.in,
        name: parameter.name,
        required: parameter.required,
        isObject: parameter.typeName === StandardType.Object,
        isArray: parameter.typeName === StandardType.Array,
        value: transformPropertyToCode(parameter, model),
      }))

    return info
  }

  /**
   * 获取接口依赖的所有的模型信息
   */
  public getDependenceModelInfo() {
    const {
      interfaces,
      allModel,
      service: { parameters, response },
    } = this.data

    const properties = parameters.concat(response as [])
    const modelNameList = getPropertyDependenceModel(properties, interfaces)

    const modelInfo = [] as { name: string; content: string }[]

    modelNameList.forEach(name => {
      const content = allModel.find(v => v.name === name)?.content || ''
      modelInfo.push({ name, content })
    })

    return modelInfo
  }
}
