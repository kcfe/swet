import {
  Method,
  ServiceParameter,
  StandardInterface,
  StandardProperty,
  StandardService,
  StandardType,
} from '../types'
import { modelNameFormatter } from '../utils'
import { SwaggerToStandard, SwaggerV2DataSource } from './types'
import { findSchema, transformSchemaToStandardProperty } from './utils'

/**
 * swaggerV2 文档适配器
 */
export function swaggerV2Adapter(originalData: SwaggerV2DataSource) {
  const { paths = {}, definitions = {}, info, tags } = originalData

  const interfaces: StandardInterface[] = []
  const controllers: Record<string, StandardService[]> = {}

  // 将 paths 转换成 controllers
  Object.entries(paths).forEach(([path, services]) => {
    Object.entries(services).forEach(([method, service]) => {
      const controller: StandardService = Object.create(null)
      const {
        tags,
        operationId,
        summary,
        consumes,
        responses,
        deprecated,
        parameters = [],
      } = service
      const controllerName = tags?.[0]

      controller['path'] = path
      controller['name'] = operationId
      controller['method'] = method as Method
      controller['controllerName'] = controllerName
      controller['description'] = summary || ''
      controller['deprecated'] = deprecated || false
      controller['contentType'] = consumes?.[0] || 'application/json'
      controller['parameters'] = []
      controller['response'] = []

      // 参数默认位置
      const defaultIn = method.toLowerCase() === 'get' ? 'query' : 'body'

      // 入参解析
      for (const parameter of parameters) {
        const { name, description, required, schema } = parameter
        const serviceParameter: ServiceParameter = Object.create(null)

        // 存在没有 name 的情况，跳过
        if (!name) continue

        const baseProperty = {
          required,
          description: description || '',
          name: modelNameFormatter(name),
          allowEmptyValue: undefined,
          in: parameter.in || defaultIn,
        }

        const standardProperty = transformSchemaToStandardProperty(schema || parameter, 2)

        Object.assign(serviceParameter, standardProperty, baseProperty)
        controller['parameters'].push(serviceParameter)
      }

      // 响应解析
      const responseSchema = findSchema(responses)
      if (responseSchema) {
        const value = transformSchemaToStandardProperty(responseSchema, 2)
        controller['response'].push(value)
      }

      controllers[controllerName]
        ? controllers[controllerName].push(controller)
        : (controllers[controllerName] = [controller])
    })
  })

  // 将 definitions 转换成 interfaces
  Object.entries(definitions).forEach(([modelName, info]) => {
    const model: StandardInterface = Object.create(null)
    model.name = modelNameFormatter(modelName)
    model.description = info.description || ''
    model.properties = []

    const { required, properties, additionalProperties } = info

    Object.entries(properties || {}).forEach(([key, property]) => {
      const propertyItem: StandardProperty = Object.create(null)

      const baseProperty = { name: key, required: required ? required.includes(key) : undefined }
      const value = transformSchemaToStandardProperty(property, 2)
      Object.assign(propertyItem, value, baseProperty)

      model.properties.push(propertyItem)
    })

    if (additionalProperties) {
      const schema = Object.assign(info, { required: undefined })
      const value = transformSchemaToStandardProperty(schema, 2)
      model.properties = [value]
    }

    if (!properties && !additionalProperties) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const typeName = (SwaggerToStandard[info['type']!] as unknown) || StandardType.Unknown
      model.properties = [
        {
          typeName,
          enum: [],
          typeValue: [],
          isMap: false,
          description: '',
        } as unknown as StandardProperty,
      ]
    }

    interfaces.push(model)
  })

  return { info, tags, controllers, interfaces }
}
