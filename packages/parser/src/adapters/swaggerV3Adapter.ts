import {
  Method,
  StandardType,
  StandardService,
  ServiceParameter,
  StandardProperty,
  StandardInterface,
} from '../types'
import { modelNameFormatter } from '../utils'
import { SwaggerToStandard, SwaggerV3DataSource } from './types'
import { findSchema, findSwaggerV3RefName, transformSchemaToStandardProperty } from './utils'

/**
 * swaggerV3 文档适配器
 */
export function swaggerV3Adapter(originalData: SwaggerV3DataSource) {
  const { paths = {}, components, info, tags } = originalData

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
        deprecated,
        requestBody,
        responses,
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

      // 第一部分入参解析
      for (const parameter of parameters) {
        const { name, description, required, schema } = parameter
        const serviceParameter: ServiceParameter = Object.create(null)

        // 存在没有 name 的情况，跳过
        if (!name) continue

        const mergeValue = {
          required,
          description: description || '',
          name: modelNameFormatter(name),
          allowEmptyValue: undefined,
          in: parameter.in || defaultIn,
        }

        const standardProperty = transformSchemaToStandardProperty(schema || parameter, 3)

        Object.assign(serviceParameter, standardProperty, mergeValue)
        controller['parameters'].push(serviceParameter)
      }

      if (requestBody) {
        // 第二部分入参解析
        const requestSchema = findSchema(requestBody)
        const requestRefName = findSwaggerV3RefName(requestBody)
        const serviceParameter: ServiceParameter = Object.create(null)
        const baseValue = {
          in: 'body',
          name: 'body',
          required: requestBody['required'],
          description: requestBody['description'] || '',
          refName: modelNameFormatter(requestRefName),
          allowEmptyValue: undefined,
          isMap: false,
          enum: [],
        }

        if (requestSchema) {
          const value = transformSchemaToStandardProperty(requestSchema, 3)
          controller['parameters'].push(Object.assign(serviceParameter, value, baseValue))
        }

        if (!requestSchema && requestRefName) {
          const defaultVal = { typeName: StandardType.Object, typeValue: [] }
          controller['parameters'].push(Object.assign(serviceParameter, baseValue, defaultVal))
        }
      }

      // 响应解析
      const responseSchema = findSchema(responses)
      if (responseSchema) {
        const value = transformSchemaToStandardProperty(responseSchema, 3)
        controller['response'].push(value)
      }

      controllers[controllerName]
        ? controllers[controllerName].push(controller)
        : (controllers[controllerName] = [controller])
    })
  })

  // 将 components 中的 schemas 转换成 interfaces
  Object.entries(components?.['schemas'] || {}).forEach(([modelName, info]) => {
    const model: StandardInterface = Object.create(null)
    model.name = modelNameFormatter(modelName)
    model.description = info.description || ''
    model.properties = []

    const { required, properties, additionalProperties } = info

    Object.entries(properties || {}).forEach(([key, property]) => {
      const modelProperty: StandardProperty = Object.create(null)

      const mergeValue = { name: key, required: required ? required.includes(key) : undefined }
      const value = transformSchemaToStandardProperty(property, 3)
      Object.assign(modelProperty, value, mergeValue)

      model.properties.push(modelProperty)
    })

    if (additionalProperties) {
      const schema = Object.assign(info, { required: undefined })
      const value = transformSchemaToStandardProperty(schema, 3)
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

  // 将 components 中的 requestBodies 转换成 interfaces
  Object.entries(components?.['requestBodies'] || {}).forEach(([modelName, info]) => {
    const name = modelNameFormatter(modelName)
    if (!interfaces.find(v => v.name === name)) {
      const model: StandardInterface = Object.create(null)
      model.name = name
      model.description = info.description || ''
      model.properties = []
      const schema = findSchema(info)

      if (schema) {
        model.properties.push(transformSchemaToStandardProperty(schema, 3))
      }

      interfaces.push(model)
    }
  })

  return { info, tags, controllers, interfaces }
}
