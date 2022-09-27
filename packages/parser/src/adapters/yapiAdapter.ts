import {
  Method,
  StandardDataSource,
  StandardInterface,
  StandardProperty,
  StandardService,
  StandardType,
} from '../types'

/**
 * yapi 文档适配器
 */
export function yapiAdapter(originalSource: YapiDataSource[]) {
  const tags: StandardDataSource['tags'] = []
  const interfaces: StandardInterface[] = []
  const controllers: Record<string, StandardService[]> = Object.create(null)

  originalSource.forEach(services => {
    const { name, desc, list } = services
    const tag = { name, description: desc }
    tags.push(tag)
    controllers[descFormatter(desc || name)] = []

    list.forEach(service => {
      const {
        title,
        path,
        method,
        desc,
        req_headers,
        req_body_form = [],
        req_query = [],
        req_body_other,
        res_schema_body,
        req_body_is_json_schema,
        res_body_is_json_schema,
      } = service
      const controller: StandardService = Object.create(null)
      // serviceName
      const serviceName = createServiceName(path, method)
      const contentType =
        req_headers?.find(v => v.name === 'Content-Type')?.value || 'application/json'

      const baseVal = {
        path,
        method,
        controllerName: descFormatter(services.desc || services.name),
        name: serviceName,
        contentType,
        deprecated: false,
        description: `${title || ''}${desc ? `(${desc})` : ''}`,
        parameters: [],
        response: [],
      }

      Object.assign(controller, baseVal)
      // body 是 schema 描述
      if (req_body_is_json_schema || req_body_other) {
        const bodyModel: StandardInterface = Object.create(null)
        bodyModel.name = serviceName + 'BodyReq'
        bodyModel.description = serviceName + 'body 请求参数'
        bodyModel.properties = []
        try {
          const jsonSchema = JSON.parse(req_body_other)
          const value = jsonSchemaToStandardProperty(jsonSchema)
          if (value.typeName !== StandardType.Array) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            bodyModel.properties = value.typeValue as any
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            bodyModel.properties.push(Object.assign(value, { enum: [], isMap: false }) as any)
          }
          // eslint-disable-next-line no-empty
        } catch (error) {}

        if (
          (bodyModel.properties.length === 1 &&
            bodyModel.properties[0].typeName === StandardType.Object &&
            bodyModel.properties[0].typeValue.length === 0) ||
          !bodyModel.properties.length
        ) {
          controller.parameters.push({
            in: 'body',
            name: 'body',
            allowEmptyValue: undefined,
            required: undefined,
            description: bodyModel.description,
            typeName: StandardType.Object,
            typeValue: [],
            isMap: false,
            enum: [],
          })
        } else {
          controller.parameters.push({
            in: 'body',
            name: 'body',
            description: bodyModel.description,
            typeName: StandardType.Object,
            typeValue: [],
            refName: bodyModel.name,
            isMap: false,
            enum: [],
          })
          interfaces.push(bodyModel)
        }
      }

      // query 信息
      if (req_query.length) {
        const queryModel: StandardInterface = Object.create(null)
        queryModel.name = serviceName + `QueryReq`
        queryModel.description = serviceName + 'query 请求参数'
        queryModel.properties = []
        req_query.forEach(queryItem => {
          const { name, desc, required } = queryItem
          queryModel.properties.push({
            name,
            description: desc,
            typeName: 'any' as StandardType,
            typeValue: [],
            required: required === '0' ? false : true,
            allowEmptyValue: required === '0' ? true : false,
            enum: [],
            isMap: false,
          })
        })
        controller['parameters'].push({
          name: 'query',
          refName: queryModel.name,
          in: 'query',
          description: queryModel.description,
          allowEmptyValue: undefined,
          typeName: StandardType.Object,
          typeValue: [],
          isMap: false,
          enum: [],
        })
        interfaces.push(queryModel)
      }

      // form-data 信息
      if (req_body_form.length) {
        const formModel: StandardInterface = Object.create(null)
        formModel.name = serviceName + `FormReq`
        formModel.description = serviceName + 'form-data 请求参数'
        formModel.properties = []
        req_body_form.forEach(bodyItem => {
          const { type = 'any', name, desc, required } = bodyItem
          formModel.properties.push({
            name,
            description: desc,
            typeName: type === 'file' ? StandardType.File : (type as StandardType),
            typeValue: [],
            required: required === '0' ? false : true,
            allowEmptyValue: required === '0' ? true : false,
            enum: [],
            isMap: false,
          })
        })
        controller['parameters'].push({
          name: 'formData',
          refName: formModel.name,
          in: 'formData',
          allowEmptyValue: undefined,
          required: undefined,
          description: formModel.description,
          typeName: StandardType.Object,
          typeValue: [],
          isMap: false,
          enum: [],
        })
        interfaces.push(formModel)
      }

      // response 信息
      if (res_body_is_json_schema || res_schema_body) {
        const resModel: StandardInterface = Object.create(null)
        resModel.name = serviceName + 'Response'
        resModel.description = serviceName + 'Response 响应信息'
        resModel.properties = []
        try {
          const jsonSchema = JSON.parse(res_schema_body)
          const value = jsonSchemaToStandardProperty(jsonSchema)
          if (value.typeName !== StandardType.Array) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            resModel.properties = value.typeValue as any
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            resModel.properties.push(Object.assign(value, { enum: [], isMap: false }) as any)
          }
          // eslint-disable-next-line no-empty
        } catch (error) {}

        if (!resModel.properties.length) {
          controller.response.push({
            typeName: StandardType.Object,
            typeValue: [],
            isMap: false,
            enum: [],
            required: true,
          })
        } else {
          controller.response.push({
            typeName: StandardType.Object,
            typeValue: [],
            refName: resModel.name,
            isMap: false,
            enum: [],
            required: true,
          })
          interfaces.push(resModel)
        }
      } else {
        controller.response.push({
          typeName: 'any' as StandardType,
          typeValue: [],
          isMap: false,
          enum: [],
          required: true,
        })
      }

      controllers[descFormatter(services.desc || name)].push(controller)
    })
  })

  return { tags, interfaces, controllers, info: Object.create(null) }
}

/**
 * 生成函数名称
 */
function createServiceName(path: string, method: string) {
  path = path.replace(/[{|}]/g, '').replace(/\/\/?/g, '_')
  const hump = path.replace(/[_|\-|\s](\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })

  return (
    hump.slice(0, 1).toLowerCase() +
    hump.slice(1) +
    method.slice(0, 1).toUpperCase() +
    method.slice(1).toLowerCase()
  )
}

/**
 * 将 json schema 定义转换成 标准输出属性信息
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jsonSchemaToStandardProperty(jsonSchema: Record<string, any>): any {
  let typeName = 'any'
  const description = jsonSchema.description
  const typeValue: StandardProperty[] = []

  try {
    const type = jsonSchema.type
    const properties = jsonSchema.properties || {}
    const requiredKeys = jsonSchema.required || []
    const items = jsonSchema.items

    if (items && type === 'array') {
      const value = jsonSchemaToStandardProperty(items)
      const typeValueItem = { required: false, isMap: false, enum: [], ...value }
      typeValue.push(typeValueItem)
    } else {
      Object.entries(properties).forEach(([key, info]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = jsonSchemaToStandardProperty(info as Record<string, any>)
        const typeValueItem = {
          name: key,
          required: requiredKeys.includes(key),
          isMap: false,
          enum: [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          description: (info as Record<string, any>).description || '',
          ...value,
        }
        typeValue.push(typeValueItem)
      })
    }

    // 目前只看到这几张情况，其他的先不处理
    switch (type) {
      case 'integer':
      case 'string':
        typeName = StandardType.String
        break
      case 'number':
        typeName = StandardType.Number
        break
      case 'object':
        typeName = StandardType.Object
        break
      case 'array':
        typeName = StandardType.Array
        break
      default:
        typeName = 'any'
    }
    // eslint-disable-next-line no-empty
  } catch (error) {}

  return { typeName, typeValue, description }
}

/**
 * 格式化描述信息
 */
function descFormatter(desc = '') {
  return desc.replace(/\s/g, '')
}

export interface YapiDataSource {
  name: string
  desc: string
  list: ListItem[]
}

interface ListItem {
  path: string
  method: Method
  desc?: string
  title: string
  res_body: string
  req_body_type: string
  res_body_type: string
  res_schema_body: string
  req_body_other: string
  res_body_is_json_schema: boolean
  req_body_form: ReqBodyFormItem[]
  req_body_is_json_schema: boolean
  req_params: ReqParamsItem[]
  req_headers: ReqHeadersItem[]
  req_query: ReqQueryItem[]
}

interface ReqBodyFormItem {
  _id: string
  desc: string
  type: string
  name: string
  required: '0' | '1'
}

interface ReqParamsItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

interface ReqHeadersItem {
  _id: string
  value: string
  name: string
  required: '0' | '1'
}

interface ReqQueryItem {
  _id: string
  desc: string
  name: string
  required: '0' | '1'
}
