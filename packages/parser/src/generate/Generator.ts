import { Mock } from './Mock'
import { Model } from './Model'
import { Service } from './Service'

export class CodeGenerator {
  // 此处的 config 会是 cli 的 config
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public config: Record<string, any>) {}

  /**
   * model code 模版
   */
  public generateModelCodeTemplate(model: Model) {
    return model.getDefaultModelCode()
  }

  /**
   * service code 模版
   */
  public generateServiceCodeTemplate(service: Service) {
    return service.getDefaultServiceCode()
  }

  /**
   * mock code 模版
   */
  public generateMockCodeTemplate(mock: Mock) {
    return mock.getDefaultMockCode.bind(mock)
  }
}
