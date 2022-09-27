import { StandardProperty, StandardType } from '../types'
import { isObject, modelNameFormatter } from '../utils'
import { SwaggerSchema, SwaggerToStandard, SwaggerVersion } from './types'

/**
 * 转换 swagger schema 为标准输出属性格式
 * @param schema swagger 文档 schema 信息描述
 * @param version swagger 文档版本
 */
export function transformSchemaToStandardProperty(schema: SwaggerSchema, version: SwaggerVersion) {
  const {
    type,
    items,
    required,
    properties = {},
    enum: enums = [],
    description = '',
    allowEmptyValue,
    additionalProperties,
  } = schema

  // 是否是 map 数据结构
  let isMap = false
  const typeValue: StandardProperty[] = []
  const refNameList = schema['$ref']?.split('/') || []
  let refName = modelNameFormatter(refNameList[version] || refNameList[refNameList.length - 1])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let typeName: any =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    SwaggerToStandard[type!] || (refName ? StandardType.Object : StandardType.Unknown)

  const defaultTypeValue = { typeName: StandardType.Unknown, typeValue: [], isMap: false, enum: [] }

  // 数组情况特殊处理
  if (typeName === StandardType.Array) {
    if (items) {
      const refNameList = items['$ref']?.split('/') || []
      refName = modelNameFormatter(refNameList[version] || refNameList[refNameList.length - 1])
      if (!refName) {
        typeValue.push(transformSchemaToStandardProperty(items, version))
      }
    } else {
      typeValue.push(defaultTypeValue)
    }
  }

  for (const key in properties) {
    const value = transformSchemaToStandardProperty(properties[key], version)
    typeValue.push(Object.assign({ name: key }, value))
  }

  // 存在此属性 typeName, refName 需要重新赋值
  if (additionalProperties) {
    const { $ref, type, items } = additionalProperties

    isMap = true
    const refNameList = $ref?.split('/') || []
    refName = modelNameFormatter(refNameList[version] || refNameList[refNameList.length - 1])
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    typeName = SwaggerToStandard[type!] || (refName ? StandardType.Object : StandardType.Unknown)

    if (!refName) {
      // 数组情况特殊处理
      if (typeName === StandardType.Array) {
        if (items) {
          const refNameList = items['$ref']?.split('/') || []
          refName = modelNameFormatter(refNameList[version] || refNameList[refNameList.length - 1])
          if (!refName) {
            typeValue.push(transformSchemaToStandardProperty(items, version))
          }
        } else {
          typeValue.push(defaultTypeValue)
        }
      }
    }
  }

  return {
    isMap,
    refName,
    typeName,
    typeValue,
    required,
    description,
    enum: enums,
    allowEmptyValue,
  }
}

/**
 * 查找出文档信息中的 schema 结构
 * @param obj
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findSchema(obj: any) {
  if (!isObject(obj)) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let schema: any

  for (const key in obj) {
    const val = obj[key]

    if (key === 'schema') {
      schema = val
      break
    }

    schema = findSchema(val)

    if (schema) break
  }

  return schema
}

/**
 * 查询出 swagger3 文档 requestBody 中的引用名称
 * @param obj
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findSwaggerV3RefName(obj: any) {
  if (!isObject(obj)) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let refName: any

  for (const key in obj) {
    const val = obj[key]

    if (key === '$ref') {
      refName = (val as string)?.split('/')[3]
      break
    }

    refName = findSwaggerV3RefName(val)

    if (refName) break
  }

  return refName
}
