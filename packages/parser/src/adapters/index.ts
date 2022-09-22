import { isArray } from '../utils'
import { Document, StandardDataSource } from '../types'
import { swaggerV2Adapter } from './swaggerV2Adapter'
import { swaggerV3Adapter } from './swaggerV3Adapter'
import { SwaggerV2DataSource, SwaggerV3DataSource } from './types'
import { yapiAdapter, YapiDataSource } from './yapiAdapter'

export class Adapter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private document: Document, public config: Record<string, any>) {}

  /**
   * 适配文档格式前，可对输入数据做一些清洗修改
   * @param document
   */
  public transformBefore(document: Document): Document {
    return document || this.document
  }

  /**
   * 输入数据适配成输出数据
   * @param originalData
   */
  public transformer(originalData: Document): StandardDataSource {
    if (isArray(originalData)) {
      return yapiAdapter(originalData as YapiDataSource[])
    }

    if (originalData.openapi && originalData.components) {
      return swaggerV3Adapter(originalData as SwaggerV3DataSource)
    }

    return swaggerV2Adapter(originalData as SwaggerV2DataSource)
  }

  /**
   * 适配文档之后，在保留原有数据结构的情况下对输出数据做拓展修改
   * @param standardData
   */
  public transformAfter(standardData: StandardDataSource): StandardDataSource {
    return standardData
  }
}
