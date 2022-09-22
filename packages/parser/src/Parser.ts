import { Mock } from './generate/Mock'
import { Model } from './generate/Model'
import { Service } from './generate/Service'
import { defaultParserConfig } from './config'
import { CodeGenerator } from './generate/Generator'
import { Document, StandardDataSource, SwetParserConfig, SwetParserConfigRequired } from './types'
// https://prettier.io/docs/en/browser.html(跨平台，支持浏览器使用)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { format } = require('prettier/standalone')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parserTs = require('prettier/parser-typescript')

export class SwetParser {
  /**
   * 原始输入数据源
   */
  readonly originalDataSource: Document

  /**
   * 标准输出数据源
   */
  readonly standardDataSource: StandardDataSource

  /**
   * 配置项
   */
  public config: SwetParserConfig

  /**
   * 代码格式化配置项
   */
  private formatConfig: SwetParserConfigRequired['prettierConfig']

  /**
   * 代码生成构造器
   */
  private generator: CodeGenerator

  /**
   * @param originalData 原始文档数据
   * @param config parser 配置项
   */
  constructor(originalData: Document, config?: SwetParserConfig) {
    this.originalDataSource = originalData

    // 合并配置项
    Object.assign(defaultParserConfig, config)
    // 将配置项暴露
    this.config = defaultParserConfig

    const {
      prettierConfig,
      CodeGenerator: CustomizeCodeGenerator,
      Adapter,
    } = defaultParserConfig as SwetParserConfigRequired

    this.generator = new CustomizeCodeGenerator(defaultParserConfig)

    // 合并代码格式化配置项
    this.formatConfig = Object.assign(prettierConfig, { plugins: [parserTs] })

    const adapter = new Adapter(originalData, defaultParserConfig)

    // 适配前修改数据
    const transformOriginalData = adapter.transformBefore(originalData)
    // 适配数据源
    const standardData = adapter.transformer(transformOriginalData)
    // 适配后修改数据
    const transformStandardData = adapter.transformAfter(standardData)

    // 原始数据转换为标准输出数据
    this.standardDataSource = transformStandardData
  }

  /**
   * 获取所有的模型信息
   */
  public getAllModel() {
    const { interfaces } = this.standardDataSource

    const allModel = interfaces.map(inter => {
      const payload = { inter, inters: interfaces }
      const model = new Model(payload, defaultParserConfig)

      const defaultCode = this.generator.generateModelCodeTemplate(model)

      const content = format(defaultCode, this.formatConfig)

      const modelInfo = Object.assign({ content }, model.getModelInfo())

      return modelInfo
    })

    return allModel
  }

  /**
   * 获取所有的接口信息
   */
  public getAllService() {
    const allModel = this.getAllModel()

    const { controllers, interfaces } = this.standardDataSource
    const services = Object.values(controllers).flat()

    const allService = services.map(service => {
      const payload = { service, allModel, interfaces }
      const instance = new Service(payload, defaultParserConfig)

      // model info
      const models = instance.getDependenceModelInfo()

      const defaultCode = this.generator.generateServiceCodeTemplate(instance)

      const content = format(defaultCode, this.formatConfig)

      const serviceInfo = Object.assign({ content, models }, service)

      return serviceInfo
    })

    return allService
  }

  /**
   * 获取所有的 mock 信息
   */
  public getAllMock() {
    const { interfaces, controllers } = this.standardDataSource
    const serviceList = Object.values(controllers).flat()

    const allMock = serviceList.map(service => {
      const payload = { service, interfaces }
      const mock = new Mock(payload, interfaces)

      const getDefaultMockCode = this.generator.generateMockCodeTemplate(mock)

      const mockInfo = Object.assign({ toCode: getDefaultMockCode }, service)

      return mockInfo
    })

    return allMock
  }
}
