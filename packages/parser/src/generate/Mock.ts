/* eslint-disable @typescript-eslint/no-explicit-any */
import mockjs from 'mockjs'
import { StandardInterface, StandardProperty, StandardService, StandardType } from '../types'
import { isArray, isBoolean, isNumber, isObject, isString } from '../utils'

/**
 * 生成 mock 数据所需数据
 */
interface MockPayload {
  service: StandardService
  interfaces: StandardInterface[]
}

/**
 * 解析属性成对应 mock 数据
 */
interface PropertyToCode {
  level: number
  property: StandardProperty
  prevData?: any
}

/**
 * 解析基本类型属性项成对应 mock 数据
 */
interface MockBaseProperty {
  /** 字段名称 */
  name?: string
  /** 枚举 */
  enums: any[]
  /** 已存在的 mock 数据 */
  prevData?: any
}

/**
 * 解析对象类型属性成对应 mock 数据
 */
export interface MockObjProperty {
  /** 递归层级 */
  level: number
  /** 属性项描述信息 */
  property: StandardProperty
  /** 已存在的初始 mock 数据 */
  prevData?: any
}

/**
 * mock 数据构造器
 */
export class Mock {
  constructor(public data: MockPayload, public config: Record<string, any>) {}

  /**
   * mock 数据默认代码模版
   * @param prevDate 已存在的 mock 数据
   */
  public getDefaultMockCode(prevData?: any) {
    const property = this.data.service.response?.[0]
    return this.generateMockCode({ level: 0, property, prevData })
  }

  private generateMockCode(payload: PropertyToCode) {
    const { level, property, prevData } = payload

    // 没有属性信息直接退出
    if (!property) {
      return level === 0 ? {} : undefined
    }

    // 超过最大递归层级退出
    if (level === 5) return undefined

    let value
    const newLevel = level + 1
    const { name, typeName, isMap, enum: enums } = property

    const mockBasePayload = { name, enums, prevData }
    const mockObjPayload = { level: newLevel, property, prevData }

    switch (typeName) {
      case StandardType.String:
        value = this.mockString(mockBasePayload)
        break
      case StandardType.Number:
        value = this.mockNumber(mockBasePayload)
        break
      case StandardType.Boolean:
        value = this.mockBoolean(prevData)
        break
      case StandardType.Object:
        value = this.mockObject(mockObjPayload)
        break
      case StandardType.Array:
        value = this.mockArray(mockObjPayload)
        break
      default:
        value = `@string`
    }

    if (isObject(value) && Object.values(value)[0] === undefined) {
      value = {}
    }

    if (isArray(value) && value[0] === undefined) {
      value = []
    }

    return isMap ? { data: value } : value
  }

  public mockString(payload: MockBaseProperty) {
    const { name, enums, prevData } = payload

    if (enums?.length) {
      if (enums.includes(prevData)) {
        return prevData
      }

      return enums[Math.floor(Math.random() * enums.length)]
    }

    if (isString(prevData) || isString(mockjs.mock(prevData))) {
      return prevData
    }

    if (!name) return '@string'

    let value = '@string'

    const lowerCaseName = name.toLowerCase()

    if (lowerCaseName.endsWith('date') || lowerCaseName.endsWith('time')) {
      value = '@dateTime'
    }

    if (lowerCaseName.endsWith('id')) {
      value = `@integer(1, 100000)`
    }

    if (lowerCaseName.includes('url')) {
      if (lowerCaseName.includes('img') || lowerCaseName.includes('image')) {
        value = '@img'
      } else {
        value = '@url(https)'
      }
    }

    if (lowerCaseName.endsWith('title')) {
      value = '@title'
    }

    if (lowerCaseName.includes('email')) {
      value = '@email'
    }

    if (lowerCaseName.includes('region')) {
      value = '@region'
    }

    if (lowerCaseName.includes('province')) {
      value = '@province'
    }

    if (lowerCaseName.includes('city')) {
      value = '@city'
    }

    if (lowerCaseName.includes('county')) {
      value = '@county'
    }

    if (lowerCaseName.includes('zip')) {
      value = '@zip'
    }

    return value
  }

  public mockBoolean(prevData?: any) {
    if (isBoolean(prevData) || isBoolean(mockjs.mock(prevData))) {
      return prevData
    }

    return `@boolean`
  }

  public mockNumber(payload: MockBaseProperty) {
    const { name, enums, prevData } = payload

    if (enums?.length) {
      if (enums.includes(prevData)) {
        return prevData
      }
      return enums[Math.floor(Math.random() * enums.length)]
    }

    if (isNumber(prevData) || isNumber(mockjs.mock(prevData))) {
      return prevData
    }

    if (!name) {
      return `@integer(1, 100)`
    }

    const lowerCaseName = name.toLowerCase()
    if (lowerCaseName.endsWith('date') || lowerCaseName.endsWith('time')) {
      return '@dateTime'
    }

    if (lowerCaseName.endsWith('id')) {
      return `@integer(1, 100000)`
    }

    return `@integer(1, 100)`
  }

  public mockObject(payload: MockObjProperty) {
    const {
      level,
      prevData,
      property: { refName, typeValue, isMap },
    } = payload

    const value = Object.create(null)

    // 如果只定义了是个 Object 没有任何描述信息
    if (!refName && !typeValue.length) {
      return isObject(prevData) ? prevData : { data: '@string' }
    }

    let finalValList = typeValue.filter(v => v.name)

    if (refName) {
      const { interfaces } = this.data
      finalValList = interfaces.find(v => v.name === refName)?.properties?.filter(v => v.name) || []
    }

    if (!finalValList.length) {
      return { data: '@string' }
    }

    for (const property of finalValList) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value[property.name!] = this.generateMockCode({
        property,
        level,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        prevData: isMap ? prevData?.['data']?.[property.name!] : prevData?.[property.name!],
      })
    }

    return value
  }

  public mockArray(payload: MockObjProperty) {
    const {
      level,
      prevData,
      property: { refName, typeValue },
    } = payload

    const value: any[] = []
    const mockIsArray = isArray(prevData)
    const { interfaces } = this.data

    // mock 数组长度
    const mockLen = mockIsArray ? prevData.length : Math.ceil(Math.random() * 5)
    // 属性项描述信息
    const properties = interfaces.find(v => v.name === refName)?.properties?.filter(v => v.name)

    for (let i = 0; i < mockLen; i++) {
      if (!properties) {
        const mockItem = this.generateMockCode({
          level,
          property: typeValue[0],
          prevData: mockIsArray ? prevData[i] : undefined,
        })

        value.push(mockItem)
        continue
      }

      const mockItemObj = Object.create(null)
      for (const property of properties) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        mockItemObj[property.name!] = this.generateMockCode({
          level,
          property,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          prevData: mockIsArray ? (prevData as [])[i]?.[property.name!] : undefined,
        })
      }

      value.push(mockItemObj)
    }

    return value
  }
}
