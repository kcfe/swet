/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path'
import fs from 'fs-extra'
import axios from 'axios'
import { cloneDeep } from 'lodash'
import { logger } from './logger'
import { isObject, isFunction } from '@swet/parser'
import { SwetCliConfigRequired, SwetCliConfig } from '../types'
import inquirer, { ChoiceOptions } from 'inquirer'
import requireFromString from 'require-from-string'
import { transpileModule, ModuleResolutionKind, ScriptTarget, ModuleKind } from 'typescript'
import { defaultSwetCliConfig, prettierConfigFileNames, swetConfigFileNames } from '../config'

/**
 * 日志输出
 */
export * from './logger'

/**
 * 获取文件内容信息
 * @param path 文件路径
 * @returns 文件内容
 */
export function loadFile(path: string) {
  let jsResult = ''
  const fileResult = fs.readFileSync(path, 'utf-8')

  if (path.endsWith('.ts')) {
    jsResult = transpileModule(fileResult, {
      compilerOptions: {
        moduleResolution: ModuleResolutionKind.NodeJs,
        target: ScriptTarget.ES3,
        module: ModuleKind.CommonJS,
        strict: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        declaration: true,
        downlevelIteration: true,
      },
    }).outputText
  }

  if (path.endsWith('.js')) {
    jsResult = fileResult
  }

  // 不是 js 或者 ts 文件内容统一按照 json 格式处理
  if (!jsResult) {
    return fs.readJSONSync(path)
  }

  const result = requireFromString(jsResult, path)
  return result.default || result
}

/**
 * 将 ts 代码编译成 js 代码
 * @param content 文件内容
 * @returns js 类型文件内容
 */
export function compileTsToJs(content: string) {
  return transpileModule(content, {
    compilerOptions: {
      allowJs: true,
      target: ScriptTarget.ES2017,
    },
  }).outputText
}

/**
 * 命令行切换选择交互
 * @param message 提示信息
 * @param choices 选项
 * @param defaultValue 默认值
 * @returns
 */
export async function select<T = string, U = ChoiceOptions>(
  message: string,
  choices: U[],
  defaultValue?: string
): Promise<T> {
  const fields = [
    {
      name: 'name',
      message,
      type: 'list',
      choices,
      default: defaultValue,
    },
  ]
  const answers = await inquirer.prompt(fields)
  return answers.name
}

/**
 * 检查配置文件是否存在
 * @param rootPath 项目根路径
 * @param configFiles 配置文件
 * @returns 文件路径
 */
export function checkSwetConfigFile(rootPath = process.cwd(), configFiles = swetConfigFileNames) {
  let fileName = ''

  for (const name of configFiles) {
    const filePath = path.join(rootPath, name)
    if (fs.existsSync(filePath)) {
      fileName = filePath
      break
    }
  }

  return fileName || false
}

/**
 * 判断是否是远程地址
 * @param source 文档地址
 * @returns boolean
 */
export function isRemoteSource(source: string) {
  return /^https?:\/\/\w+/.test(source)
}

/**
 * 检查文件是否存在且存在则返回绝对路径
 * @param filePath 文件地址
 * @param rootPath 项目根路径
 * @returns 文件绝对路径
 */
export function checkFilePath(filePath: string, rootPath = process.cwd()) {
  if (!fs.existsSync(filePath)) {
    return false
  }

  const fileStats = fs.statSync(filePath)
  if (!fileStats.isFile()) {
    return false
  }

  if (path.isAbsolute(filePath)) {
    return filePath
  } else {
    return path.join(rootPath, filePath)
  }
}

/**
 * @description 存在默认的 swetConfig 将不会再读取配置文件
 * @param initialConfig 默认的swetConfig
 * @returns
 */
export function getSwetCliConfig(initialConfig?: SwetCliConfig | SwetCliConfig[]) {
  const supportTs =
    fs.existsSync(path.join(process.cwd(), 'tsconfig.json')) ||
    fs.existsSync(path.join(process.cwd(), 'tsconfig.base.json'))

  const baseConfig = Object.assign({ language: supportTs ? 'ts' : 'js' }, defaultSwetCliConfig)
  // 获取代码格式化文件
  const prettierFileName = checkSwetConfigFile(process.cwd(), prettierConfigFileNames)

  // 检查是否存在配置文件
  const cliConfigFileName = checkSwetConfigFile() as string
  if (!cliConfigFileName && !initialConfig) {
    return
  }

  // 检查格式化代码文件
  if (prettierFileName) {
    try {
      const prettierConfig: Record<string, any> = loadFile(prettierFileName)
      Object.assign(baseConfig.prettierConfig || {}, prettierConfig)
    } catch (error) {
      logger.warn(`[swet-cli] failed to load prettier file, please check ${prettierFileName}`)
    }
  }

  let swetConfigs = [] as SwetCliConfigRequired[]

  try {
    swetConfigs = initialConfig || loadFile(cliConfigFileName)
    swetConfigs = (swetConfigs as Record<string, any>)?.swet || swetConfigs

    if (typeof swetConfigs === 'function') {
      // eslint-disable-next-line @typescript-eslint/ban-types
      swetConfigs = (swetConfigs as Function)()
    }

    if (!Array.isArray(swetConfigs)) {
      swetConfigs = [swetConfigs]
    }

    swetConfigs = swetConfigs.map((config, index) => {
      config.name = config.name || `数据源(${index})`

      // 合并代码格式化配置文件
      config.prettierConfig = Object.assign(
        baseConfig.prettierConfig || {},
        config.prettierConfig || {}
      )
      config.mocks = Object.assign(baseConfig.mocks || {}, config.mocks || {})

      return Object.assign(cloneDeep(baseConfig), config)
    })

    return swetConfigs
  } catch (error) {
    logger.error(`[swet-cli] failed to parse configuration file, please check [${error}]`)
  }
}

/**
 * 获取文档数据
 * @param url 文档地址
 * @param headers 请求文档 headers
 * @returns 文档数据
 */
export async function loadDocument(
  url: string,
  headers: SwetCliConfigRequired['fetcher']
): Promise<any> {
  try {
    if (isFunction(headers)) {
      return await headers()
    }

    // 文档数据
    let document = Object.create(null)
    if (!isRemoteSource(url)) {
      document = fs.readJSONSync(url)
      return document
    }

    for (const key in headers) {
      const value = headers[key]
      if (isObject(value)) {
        headers[key] = JSON.stringify(value)
      }
    }

    const { data } = await axios.request({
      url,
      method: 'get',
      headers: headers as Record<string, any>,
      timeout: 10000,
    })

    return data
  } catch (error: any) {
    const status = error?.response?.status
    // 未关闭 sso 校验
    if ([302, 307].includes(status)) {
      logger.error(
        `[swet-cli] [${url}] obtaining failed, please confirm that the back-end service has turned off sso verification`
      )
    }
    // 连接后端失败
    if ([502].includes(status)) {
      logger.error(
        `[swet-cli] [${url}] obtaining failed，please confirm whether the backend service is enabled`
      )
    }
    // 未知错误，加载文档失败
    logger.error(`[swet-cli] [${url}] obtaining failed ${error}`)
  }
}
