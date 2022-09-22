import {
  modelNameFormatter,
  upperCaseFirstLetter,
  transformPropertyToCode,
  getPropertyDependenceModel,
} from '../utils'
import { StandardInterface } from '../types'

/**
 * 生成模型代码所需的数据
 */
interface ModelPayload {
  /** 当前模型信息 */
  inter: StandardInterface
  /** 所有模型信息 */
  inters: StandardInterface[]
}

/**
 * 模型数据构造器
 */
export class Model {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public data: ModelPayload, public config: Record<string, any>) {}

  /**
   * 模型默认代码模版
   */
  public getDefaultModelCode() {
    const modelInfo = this.getModelInfo()
    let { name } = modelInfo
    const { description, children } = modelInfo

    name = modelNameFormatter(name)

    let content = description ? `\n\n/** ${description} */\n` : '\n\n'

    // 只有一项，且没有名字的情况
    if (children.length === 1 && !children[0].name) {
      content += `export type ${name} = ${children[0].value}\n`
      return content
    }

    const newChildren = children.filter(v => v.name)

    content += `export interface ${name} {`

    for (const item of newChildren) {
      content += item.description ? `\n/** ${item.description} */` : ''
      content += `\n${item.name}${item.required ? '' : '?'}: ${item.value}`
    }

    return (content += `\n}\n`)
  }

  /**
   * 获取模型的上下文信息
   * 可用于拼接模型代码
   */
  public getModelInfo() {
    const { inter } = this.data
    const { name, description, properties } = inter

    const modelName = upperCaseFirstLetter(name)

    const children = properties.map(property => ({
      name: property.name,
      required: property.required,
      description: property.description,
      value: transformPropertyToCode(property),
    }))

    return {
      name: modelName,
      description,
      children,
      dependence: this.getDependenceModel(),
    }
  }

  /**
   * 获取当前模型依赖的其他模型名称
   */
  public getDependenceModel() {
    const {
      inters,
      inter: { properties },
    } = this.data
    return getPropertyDependenceModel(properties, inters)
  }
}
