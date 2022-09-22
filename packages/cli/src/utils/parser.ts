import {
  Service,
  isObject,
  Adapter,
  Document,
  CodeGenerator,
  StandardService,
  StandardProperty,
  StandardInterface,
  StandardDataSource,
  upperCaseFirstLetter,
  getPropertyDependenceModel,
} from '@swet/parser'
import { SwetCliConfigRequired } from '../types'

/**
 * swet-cli 默认 service 代码模版
 */
export class SwetCliCodeGenerator extends CodeGenerator {
  constructor(public config: SwetCliConfigRequired) {
    super(config)
  }

  public generateServiceCodeTemplate(service: Service): string {
    const { name, method, description, deprecated, controllerName } = service.data.service

    const {
      url,
      headers: defaultHeaders,
      payloadCode,
      queryCode,
      bodyCode,
      responseCode,
    } = service.getEachPartCode('model')

    const { transformService } = this.config

    const { headers = {} } = transformService?.(service.data.service) || {}

    Object.assign(headers, defaultHeaders)

    for (const key in headers) {
      const value = headers[key]
      if (isObject(value)) {
        headers[key] = JSON.stringify(value)
      }
    }

    let content = deprecated
      ? `\n\n/**
            * @deprecated
            * ${controllerName} ${description || ''}
            */\n`
      : `\n\n/** ${controllerName} ${description || ''} */\n`

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
}

/**
 * swet-cli 默认 Adapter 适配器
 */
export class SwetCliAdapter extends Adapter {
  constructor(document: Document, config: SwetCliConfigRequired) {
    super(document, config)
  }

  public transformAfter(standardData: StandardDataSource): StandardDataSource {
    return decorator(standardData, this.config as SwetCliConfigRequired)
  }
}

/**
 * 标准输出数据装饰器
 * 做一些配置项的处理
 */
export function decorator(dataSource: StandardDataSource, config: SwetCliConfigRequired) {
  const { interfacePrefix, parameterMode, transformService } = config

  const { controllers, interfaces = [] } = dataSource

  // 获取所有作为响应的模型名称
  const responseList = Object.values(controllers)
    .flat()
    .map(v => v.response[0])
    .filter(Boolean)
  // 一个个解析，让相关的模型放在一起
  const resModelNames = responseList.map(v => getPropertyDependenceModel([v], interfaces)).flat()

  // 获取所有作为入参的模型名称
  const parameterList = Object.values(controllers)
    .flat()
    .map(v => v.parameters)
    .flat()
    .filter(Boolean)
  const parameterModelNames = parameterList
    .map(v => getPropertyDependenceModel([v], interfaces))
    .flat()

  // 所有使用到的模型
  const allModel = Array.from(new Set(parameterModelNames.concat(resModelNames)))

  // 记录所有的默认方法名
  const defaultNameList: string[] = []

  const controllersFilter: Record<string, StandardService[]> = {}
  // 处理 controllers
  Object.entries(controllers).forEach(([controllerName, services]) => {
    const servicesFilter: StandardService[] = []

    for (const service of services) {
      const { path, method, name, parameters, response } = service
      // 接口默认方法名称
      const defaultName = generateDefaultServiceName({
        method,
        path,
        operationId: name,
        defaultNameList,
      })

      defaultNameList.push(defaultName)

      const newService = { ...service, name: defaultName, operationId: name }

      const { baseUrl = '', name: customName = defaultName } = transformService?.(newService) || {}

      // 转换后的方法名称
      newService.name = customName
      newService.path = baseUrl + path

      // 对入参和响应信息做处理
      newService.parameters = decoratorProperty({
        properties: parameters,
        resModel: false,
        isParameter: true,
        interfacePrefix,
        parameterMode,
      })
      newService.response = decoratorProperty({
        properties: response,
        resModel: true,
        interfacePrefix,
        parameterMode,
      })

      servicesFilter.push(newService)
    }

    controllersFilter[controllerName] = servicesFilter
  })

  // 处理 interfaces
  const interfacesFilter: StandardInterface[] = []

  for (const modelName of allModel) {
    const inter = interfaces.find(v => v.name === modelName)

    if (!inter) continue

    const { name, properties } = inter
    const resModel = resModelNames.includes(name)

    inter.name = upperCaseFirstLetter(interfacePrefix + name)
    inter.properties = decoratorProperty({
      resModel,
      properties,
      interfacePrefix,
      parameterMode,
    })

    interfacesFilter.push(inter)
  }

  return { ...dataSource, controllers: controllersFilter, interfaces: interfacesFilter }
}

/**
 * 对标准输出数据属性做自定义拓展
 */
export function decoratorProperty<T extends StandardProperty>(payload: {
  properties: T[]
  resModel: boolean
  interfacePrefix: string
  isParameter?: boolean
  innerLayer?: boolean
  parameterMode: 'strict' | 'loose' | 'strictInfer' | 'looseInfer' | 'pureInfer'
}) {
  const { properties, resModel, interfacePrefix, parameterMode } = payload

  return properties.map(property => {
    const { refName, required, typeValue, allowEmptyValue } = property

    property.refName = refName ? upperCaseFirstLetter(interfacePrefix + refName) : undefined

    property.required = computeRequiredValue({
      options: parameterMode,
      resModel,
      required,
      allowEmptyValue,
    })

    const innerPayload = { ...payload, properties: typeValue, innerLayer: true }

    property.typeValue = decoratorProperty(innerPayload)

    return property
  })
}

/**
 * 根据不同的配置项生成 required 的值
 */
export function computeRequiredValue(payload: {
  resModel?: boolean
  required?: boolean
  allowEmptyValue?: boolean
  options: 'strict' | 'loose' | 'strictInfer' | 'looseInfer' | 'pureInfer'
}) {
  const { options, required, resModel, allowEmptyValue } = payload
  const looseRequired =
    (required ?? false) || (allowEmptyValue === undefined ? false : !allowEmptyValue)

  switch (options) {
    case 'strict':
      return required ?? false
    case 'loose':
      return looseRequired
    case 'strictInfer':
      return resModel ? required ?? true : required ?? false
    case 'looseInfer':
      return resModel
        ? required === undefined && allowEmptyValue === undefined
          ? true
          : looseRequired
        : looseRequired
    case 'pureInfer':
      return resModel ? true : required ?? false
    default:
      return required
  }
}

/**
 * 生成请求默认的方法名称
 * @param params 生成默认的方法名称所需参数
 * @returns 默认的方法名称
 */
export function generateDefaultServiceName(params: {
  path: string
  method: string
  operationId: string
  defaultNameList: string[]
}) {
  const { method, path, operationId, defaultNameList } = params

  // 首先还是优先使用 operationId(但是先对 operationId 做一些处理)
  // 将 serviceName_1，serviceName_2 处理掉后缀
  let name = operationId.split('_')[0]
  // 再将 UsingGET、UsingPOST 等处理成 Get、Post 的形式
  const regExp = /Using(GET|POST|DELETE|PUT|PATCH|HEAD|CONNECT|OPTIONS|TRACE)/g

  if (regExp.test(name)) {
    name = name.replace(regExp, upperCaseFirstLetter(method))
  }

  // 格式化 path 路径形式
  const pathFormat = path.replace(/{|}/g, '').replace(/-|_|(\/\/)/g, '/')
  const pathParts = pathFormat.split('/').filter(Boolean)
  let sliceIndex = -2

  while (defaultNameList.includes(name) || !name) {
    name = pathParts
      .slice(sliceIndex)
      .filter(Boolean)
      .map(v => upperCaseFirstLetter(v))
      .join('')

    if (!name) break

    name = name.slice(0, 1).toLowerCase() + name.slice(1) + upperCaseFirstLetter(method)
    sliceIndex -= 1
  }

  return name
}
