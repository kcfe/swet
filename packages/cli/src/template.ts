/**
 * ts 配置文件模版
 */
export const tsTemplate = `/**
 * 以下生成了一些可能会用到的常用配置项
 */

import { SwetCliConfig } from '@swet/cli'

export const swet: SwetCliConfig = {
  /** 文档地址数据源，同时支持远程路径和本地路径 */
  sources: [],
  /** 生成代码存放目录 */
  outDir: './src/apis',
}
`
/**
 * js 配置文件模版
 */
export const jsTemplate = `/**
 * 以下生成了一些可能会用到的常用配置项
 */

module.exports = () => {
  return {
    /** 文档地址数据源，同时支持远程路径和本地路径 */
    sources: [],
    /** 生成代码存放目录 */
    outDir: './src/apis',
  }
}
`
