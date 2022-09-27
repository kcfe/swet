import { BaseInfoDescription, Method, StandardType } from '../types'

/**
 * swagger 文档版本定义
 */
export type SwaggerVersion = 2 | 3

/**
 * swaggerV2 类型文档
 */
export interface SwaggerV2DataSource {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: Record<string, any>
  tags: BaseInfoDescription[]
  paths: Record<string, SwaggerV2Paths>
  definitions: Record<string, SwaggerDefinition>
}

/**
 * swaggerV3 类型文档
 */
export interface SwaggerV3DataSource {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: Record<string, any>
  tags: BaseInfoDescription[]
  paths: Record<string, SwaggerV3Paths>
  components: SwaggerV3Component
}

/**
 * swaggerV2 path 描述
 */
type SwaggerV2Paths = {
  [key in Method]: SwaggerV2PathItem
}

/**
 * swaggerV3 path 描述
 */
type SwaggerV3Paths = {
  [key in Method]: SwaggerV3PathItem
}

interface CommonPathItem {
  tags: string[]
  summary: string
  description: string
  operationId: string
  consumes: string[]
  produces: string[]
  deprecated: boolean
  parameters: SwaggerParameter[]
}

interface SwaggerV2PathItem extends CommonPathItem {
  responses: SwaggerV2Responses
}

interface SwaggerV3PathItem extends CommonPathItem {
  requestBody: SwaggerV3RequestBody
  responses: SwaggerV3Responses
}

interface SwaggerParameter extends SwaggerSchema {
  in: 'query' | 'body' | 'path' | 'formData'
  name: string
  required: boolean
  schema?: SwaggerSchema
}

export interface SwaggerSchema {
  type?: SwaggerType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enum?: any[]
  $ref?: string
  required?: boolean
  description?: string
  allowEmptyValue?: boolean
  items?: SwaggerSchema
  properties?: Record<string, SwaggerSchema>
  additionalProperties?: SwaggerSchema
}

type SwaggerV2Responses = Record<string, SwaggerV2Response>

type SwaggerV3Responses = Record<string, SwaggerV3Response>

interface SwaggerV2Response {
  description: string
  schema?: SwaggerSchema
}

interface SwaggerV3Response {
  description: string
  content: ResponseContent
}

type ResponseContent = Record<string, { schema: SwaggerSchema }>

interface SwaggerV3RequestBody {
  content: ResponseContent | SwaggerSchema
  description?: string
  required?: boolean
}

interface SwaggerV3Component {
  schemas: Record<string, SwaggerDefinition>
  requestBodies: Record<string, SwaggerV3RequestBody>
}

interface SwaggerDefinition extends Omit<SwaggerSchema, 'required'> {
  required?: string[]
}

/**
 * swagger 类型
 */
export enum SwaggerType {
  Integer = 'integer',
  Number = 'number',
  String = 'string',
  File = 'file',
  Array = 'array',
  Boolean = 'boolean',
  Object = 'object',
}

/**
 * swagger 类型对应标准类型
 */
export enum SwaggerToStandard {
  integer = StandardType.Number,
  number = StandardType.Number,
  string = StandardType.String,
  file = StandardType.File,
  array = StandardType.Array,
  boolean = StandardType.Boolean,
  object = StandardType.Object,
}
