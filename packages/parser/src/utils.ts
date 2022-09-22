import { StandardInterface, StandardProperty, StandardType } from './types'

export function isTypeOf(target: unknown, type: string): boolean {
  if (!type) {
    return false
  }

  try {
    type = type.toLocaleLowerCase()

    if (target === undefined) {
      return type === 'undefined'
    }

    if (target === null) {
      return type === 'null'
    }

    return Object.prototype.toString.call(target).toLocaleLowerCase() === `[object ${type}]`
  } catch (err) {
    return false
  }
}

/**
 * 是否是 undefined
 * @param target
 */
export function isUndefined(target: unknown): target is undefined {
  return isTypeOf(target, 'undefined')
}

/**
 * 是否是 null
 * @param target
 */
export function isNull(target: unknown): target is undefined {
  return isTypeOf(target, 'null')
}

/**
 * 是否是字符串
 * @param target
 */
export function isString(target: unknown): target is string {
  return isTypeOf(target, 'string')
}

/**
 * 是否是数字
 * @param target
 */
export function isNumber(target: unknown): target is number {
  return isTypeOf(target, 'number')
}

/**
 * 是否是对象
 * @param target
 */
export function isObject<T = Record<string, unknown>>(target: unknown): target is T {
  return isTypeOf(target, 'Object')
}

/**
 * 是否是数组
 * @param target
 */
export function isArray<T = Array<unknown>>(target: unknown): target is T {
  return isTypeOf(target, 'array')
}

/**
 * 是否是方法
 * @param target
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction<T = Function>(target: unknown): target is T {
  return isTypeOf(target, 'function')
}

/**
 * 是否是布尔值
 * @param target
 */
export function isBoolean(target: unknown): target is boolean {
  return isTypeOf(target, 'boolean')
}

/**
 * 是否是 Promise 实例
 * @param target
 */
export function isPromise<T = Promise<unknown>>(target: unknown): target is T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target && typeof (target as any).then === 'function') as boolean
}

/**
 * 是否包含中文字符串
 * @param str
 */
export function isChinese(str: string): boolean {
  return !!str.match(/[\u4e00-\u9fa5]/g)
}

/**
 * 首字母大写
 */
export function upperCaseFirstLetter(str: string): string {
  return str.slice(0, 1).toUpperCase() + str.slice(1)
}

/**
 * 格式化模型名称
 */
export function modelNameFormatter(str = ''): string {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return str
    .split('.')
    .pop()
    ?.replace(/«|»|\[|\]|\.|,|，|、|\$|\(|\)|（|）|-|\s*/g, '') as string
}

/**
 * 转换枚举定义输出
 */
export function getPrimitiveOrEnumCode(typeName: StandardType, enums: string[]) {
  if (!enums.length) {
    return typeName
  }

  if (enums.some(v => isObject(v))) {
    return typeName
  }

  return typeName === StandardType.Number ? `${enums.join(' | ')}` : `'${enums.join("' | '")}'`
}

/**
 * 将属性描述转换成对应的 code 内容
 * @param property 属性描述
 * @param globalModel modelIndex name
 */
export function transformPropertyToCode(property: StandardProperty, globalModel?: string): string {
  let value: string

  const modelIndex = globalModel ? `${globalModel}.` : ''
  const { typeName, typeValue, refName, isMap } = property

  switch (typeName) {
    case StandardType.String:
    case StandardType.Number:
    case StandardType.Boolean:
    case StandardType.File:
    case StandardType.Unknown:
      value = getPrimitiveOrEnumCode(typeName, property.enum)
      break
    case StandardType.Object:
      if (refName) {
        value = modelIndex + upperCaseFirstLetter(refName)
      } else if (typeValue.length) {
        const list = []
        for (const v of typeValue) {
          const { required, name } = v

          if (!name) continue

          list.push(`${name}${required ? '' : '?'}: ${transformPropertyToCode(v, globalModel)}`)
        }

        value = list.length ? `{${list.join('\n')}}` : 'Record<string, any>'
      } else {
        value = 'Record<string, any>'
      }
      break
    case StandardType.Array:
      value = refName
        ? `Array<${modelIndex}${upperCaseFirstLetter(refName)}>`
        : `Array<${transformPropertyToCode(typeValue[0], globalModel)}>`
      break
    default:
      value = 'any'
  }

  return isMap ? `Record<string, ${value}>` : value
}

/**
 * 获取当前属性依赖的模型名称
 * @param info 属性描叙信息
 * @param interfaces 所有的模型描述信息
 */
export function getPropertyDependenceModel(
  info: StandardProperty[],
  interfaces: StandardInterface[]
): string[] {
  const totalNames = [] as string[]
  let tempNames = getPropertyModelNames(info)

  while (tempNames.length) {
    totalNames.push(...tempNames)

    const list = interfaces
      .filter(v => tempNames.includes(v.name))
      .map(v => v.properties)
      .flat()

    const listName = list.map(v => getPropertyModelNames([v])).flat()

    tempNames = listName.filter(v => !totalNames.includes(v))
  }

  return totalNames
}

/**
 * 获取属性项中的引用模型名称
 * @param info 属性信息
 * @returns
 */
function getPropertyModelNames(info: StandardProperty[]): string[] {
  let tempFlatList = info.map(v => v.typeValue).flat()
  const modelName = info.map(v => v.refName).filter(Boolean) as string[]

  while (tempFlatList.length) {
    const list = tempFlatList.map(v => v.refName).filter(Boolean) as string[]
    tempFlatList = tempFlatList.map(v => v.typeValue).flat()
    modelName.push(...list)
  }

  return Array.from(new Set(modelName))
}
