import { Adapter } from './adapters'
import { CodeGenerator } from './generate/Generator'

/**
 * 请求方法类型
 */
export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

/**
 * 标准输出数据类型枚举
 */
export enum StandardType {
  Number = 'number',
  Boolean = 'boolean',
  String = 'string',
  Array = 'array',
  Object = 'object',
  File = 'File',
  Unknown = 'any',
}

/**
 * 标准输出数据源格式
 */
export interface StandardDataSource {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info?: Record<string, any>
  tags?: BaseInfoDescription[]
  interfaces: StandardInterface[]
  controllers: Record<string, StandardService[]>
}

/**
 * 标准输出模型描述
 */
export interface StandardInterface extends BaseInfoDescription {
  properties: StandardProperty[]
}

/**
 * 标准输出属性描述
 */
export interface StandardProperty {
  /**
   * 名称
   */
  name?: string
  /**
   * 类型
   */
  typeName: StandardType
  /**
   * 属性项描述
   */
  typeValue: StandardProperty[]
  /**
   * 引用模型名称
   */
  refName?: string
  /**
   * 是否必填
   */
  required?: boolean
  /**
   * 是否允许空值
   */
  allowEmptyValue?: boolean
  /**
   * 描述信息
   */
  description?: string
  /**
   * 是否是废弃字段
   */
  deprecated?: boolean
  /**
   * 枚举值
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enum: any[]
  /**
   * 是否是 map 类型
   */
  isMap: boolean
}

/**
 * 标准输出接口信息描述
 */
export interface StandardService extends BaseInfoDescription {
  path: string
  method: Method
  contentType: string
  deprecated: boolean
  parameters: ServiceParameter[]
  response: StandardProperty[]
  controllerName: string
}

/**
 * 标准输出接口参数信息描述
 */
export interface ServiceParameter extends StandardProperty {
  in: 'path' | 'query' | 'body' | 'formData'
}

/**
 * 基本信息描述
 */
export interface BaseInfoDescription {
  name: string
  description: string
}

/**
 * 文档类型
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Document = Record<string, any> | Record<string, any>[]

/**
 * 配置项类型定义
 */
export interface SwetParserConfig {
  /**
   * prettier 代码格式化配置项
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prettierConfig?: Record<string, any>

  /**
   * 数据格式转换适配器
   * 将文档原始数据转换成标准输出数据源格式
   */
  Adapter?: typeof Adapter

  /**
   * 代码模版生成器
   * 可以通过复写方法自定义代码模版
   */
  CodeGenerator?: typeof CodeGenerator
}
export type SwetParserConfigRequired = Required<SwetParserConfig>
