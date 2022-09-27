import { Document, SwetParserConfig } from '@swet/parser'
import { Request } from 'express'
import { Options } from 'http-proxy-middleware'

/**
 * swet-cli 配置项
 */
export interface SwetCliConfig extends SwetParserConfig {
  /**
   * 接口文档地址列表，可以是远程路径也可以是本地路径
   */
  sources: string[]

  /**
   * 生成接口代码的存放路径，使用相对路径即可；
   * 默认值：src/apis
   */
  outDir?: string

  /**
   * 生成代码的语言模版
   * 默认：判段项目根目录下是否有 tsconfig.json || tsconfig.base.json
   */
  language?: 'js' | 'ts'

  /**
   * 数据源名称，多数据源的通过制度数据源名称便于区分选择；
   * 默认：数据源+index
   */
  name?: string

  /**
   * 获取文档的方法
   * 默认获取存在问题的情况下可支持拓展
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetcher?: Record<string, any> | (() => Document)

  /**
   * 参数是否可选生成规则；
   * 默认值：pureInfer
   */
  parameterMode?: 'strict' | 'loose' | 'strictInfer' | 'looseInfer' | 'pureInfer'

  /**
   * 模型名称前缀
   */
  interfacePrefix?: string

  /**
   * 数据代理能力配置
   */
  mocks?: {
    /** mock 数据存放目录 */
    output?: string
    /** 需要转发的接口统一前缀 */
    forwardUrl?: string
    /** proxy 代理配置项，详情可见 http-proxy-middleware */
    httpProxy?: Options
    /** 代理过滤规则 */
    filterProxy?: (req: Request) => boolean
    /** 自定义 mock 数据 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transformer?: (data: any, serviceInfo: ServiceInformation) => string
  }

  /**
   * 对 service 进行拓展
   */
  transformService?: (info: ServiceInformation) => {
    /** 自定义生成方法名 */
    name?: string
    /** 添加 headers */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headers?: Record<string, any>
    /** 添加统一的路径前缀 */
    baseUrl?: string
  }

  /**
   * 对 controller 文件进行拓展
   */
  transformController?: (controllerName: string) => {
    /** 添加在 controller file 头部代码 */
    leadingCode?: string
    /** 添加在 controller file 尾部代码 */
    trailingCode?: string
    /** 自定义 controller file name */
    fileName?: string
  }
}
export type SwetCliConfigRequired = Required<SwetCliConfig>

/**
 * 描述接口的基本信息
 */
export interface ServiceInformation {
  /** 方法名 */
  name: string
  /** 请求路径 */
  path: string
  /** 请求方法 */
  method: string
  /** 方法所属 controller 模块 */
  controllerName: string
  /** swagger 文档类型 operationId */
  operationId?: string
}
