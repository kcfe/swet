/* eslint-disable @typescript-eslint/no-var-requires */
import {
  select,
  logger,
  loadDocument,
  checkFilePath,
  isRemoteSource,
  compileTsToJs,
  getSwetCliConfig,
} from '../utils'
import path from 'path'
import fs from 'fs-extra'
import { format } from 'prettier'
import { SwetCliConfigRequired } from '../types'
import { jsTemplate, tsTemplate } from '../template'
import { parsePrevServiceInfo } from '../utils/check'
import { isFunction, isArray, isObject, SwetParser } from '@swet/parser'
import { defaultMockDir, mockMethodPathFileName, swetConfigFileType } from '../config'

export class FileManager {
  /**
   * 选中配置文件 config
   */
  async getActiveConfig() {
    const swetCliConfigs = getSwetCliConfig()

    if (!swetCliConfigs) {
      await this.initConfigFile()
      logger.info(`[swet-cli] please complete the configuration file and execute it again`)
      process.exit()
    }

    let activeConfig: SwetCliConfigRequired

    if (swetCliConfigs.length === 1) {
      activeConfig = swetCliConfigs[0]
    } else {
      const answer = await select(
        'Which target would you like to checkout?',
        swetCliConfigs.map((item, index) => ({
          name: item.name,
          value: index,
        }))
      )

      activeConfig = swetCliConfigs[Number(answer)]
    }

    if (!activeConfig.sources?.length) {
      logger.error('[swet-cli] the sources attribute specifies at least one document address')
    }

    return activeConfig
  }

  /**
   * 初始化配置文件
   */
  async initConfigFile() {
    const answer = await select(
      `Please select the type of configuration file you want to generate\n`,
      swetConfigFileType.map(i => ({
        name: i,
        value: i,
      }))
    )

    try {
      const template = answer === 'typescript' ? tsTemplate : jsTemplate
      const fileName = answer === 'typescript' ? 'swet.config.ts' : 'swet.config.js'

      fs.writeFileSync(path.join(process.cwd(), fileName), template)
      logger.info(`[swet-cli] the configuration file is generated successfully`)
    } catch (err) {
      console.log(err)
    }
  }
}

export class Manager {
  /**
   * 文档地址
   */
  private documentUrl: string

  /**
   * swet parser 实例
   */
  public swetParser: SwetParser

  constructor(public config: SwetCliConfigRequired) {
    this.documentUrl = ''
    this.swetParser = undefined as unknown as SwetParser
  }

  /**
   * 生成所有所需的代码文件
   */
  public async regenerateFiles() {
    await this.selectDocumentUrl()
    await this.getParserInstance()
    this.generateServiceFiles()
    this.generateModelFiles()
    this.generateMockFiles()
  }

  /**
   * 生成接口层代码文件
   */
  public generateServiceFiles() {
    const { outDir, language, prettierConfig, transformController } = this.config
    const filePrefixPath = path.join(process.cwd(), outDir)

    const supportTs = language === 'ts'

    // 两次对比接口产物对比信息
    const checkInfo = this.comparePrevAndCurServices()

    // 移除之前的所有文件
    if (fs.existsSync(filePrefixPath)) {
      fs.removeSync(filePrefixPath)
    }

    const services = this.swetParser.getAllService()
    const serviceList = [] as { controllerName: string; code: string; model: boolean }[]

    for (const service of services) {
      const { content, models, controllerName } = service

      const alreadyService = serviceList.find(v => v.controllerName === controllerName)

      if (alreadyService) {
        alreadyService.code += `\n${content}`
        alreadyService.model = Boolean(models.length) || alreadyService.model
      } else {
        serviceList.push({
          controllerName,
          code: content,
          model: Boolean(models.length),
        })
      }
    }

    if (!fs.existsSync(filePrefixPath)) {
      fs.mkdirpSync(filePrefixPath)
    }

    serviceList.forEach(({ controllerName, code, model }, index) => {
      const name = controllerName || `controller${index}`
      const {
        leadingCode = `import axios from 'axios'`,
        trailingCode,
        fileName = name,
      } = transformController?.(name) || {}

      if (supportTs && model) {
        code = `import type * as model from './models'` + '\n\n' + code
      }

      if (leadingCode) {
        code = leadingCode + '\n' + code
      }

      if (trailingCode) {
        code += '\n\n' + trailingCode
      }

      // 不支持 ts，将 ts 代码编译成 js
      if (!supportTs) {
        code = compileTsToJs(code)
      }

      const filePath = path.join(filePrefixPath, `${fileName}${supportTs ? '.ts' : '.js'}`)

      fs.writeFileSync(filePath, format(code, { ...prettierConfig, parser: 'typescript' }))
    })

    logger.success(`[swet-cli] service file generate successfully`)

    // 输出对比信息
    if (checkInfo?.length) {
      fs.writeFileSync(
        path.join(filePrefixPath, 'check-name.json'),
        JSON.stringify(checkInfo, null, 2)
      )
      logger.warn(
        `[swet-cli] detected function name was changed, please confirm to [check-name.json] file`
      )
    }
  }

  /**
   * 生成模型层代码文件
   */
  public generateModelFiles() {
    const { outDir, language, prettierConfig } = this.config

    // 不支持 ts 的项目不生成 models.ts
    if (language == 'js') return

    const models = this.swetParser.getAllModel()

    const modelSuffixName = 'models.ts'
    const modelPrefix = path.join(process.cwd(), outDir)
    const modelFilePath = path.join(modelPrefix, modelSuffixName)

    if (!fs.existsSync(modelPrefix)) {
      fs.mkdirpSync(modelPrefix)
    }

    const code = models?.length ? models.map(v => v.content).join('\n') : ''

    if (code) {
      fs.writeFileSync(modelFilePath, format(code, { ...prettierConfig, parser: 'typescript' }))
      logger.success(`[swet-cli] models file generate successfully`)
    }
  }

  /**
   * 生成 mock 数据文件
   */
  public generateMockFiles() {
    const mockDir = this.config.mocks?.output

    // 没有 mock 文件存放路径则认为不需要生成 mock 数据
    if (!mockDir) return

    const mocks = this.swetParser.getAllMock()
    const mockPrefix = path.join(process.cwd(), mockDir, defaultMockDir)
    const mockTask = [] as { dir: string; path: string; content: string }[]

    for (const mock of mocks) {
      const { path: url, method, toCode } = mock
      const mockFileDir = path.join(mockPrefix, url)
      const mockFilePath = path.join(mockFileDir, `${method.toLowerCase()}.js`)

      let prevData = undefined

      // 判断之前是否存在 mock 数据
      if (fs.existsSync(mockFilePath)) {
        const data = require(mockFilePath)
        prevData = isFunction(data) ? data() : data
      }
      const mockData = toCode(prevData)
      const content = this.config.mocks?.transformer?.(mockData, mock) || mockData

      mockTask.push({ dir: mockFileDir, path: mockFilePath, content })
    }

    // 移除原有 mock 数据
    if (fs.existsSync(path.join(process.cwd(), mockDir, defaultMockDir))) {
      fs.removeSync(path.join(process.cwd(), mockDir, defaultMockDir))
    }

    const syncTaskList = [] as Promise<void>[]
    mockTask.forEach(({ dir, path, content }) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirpSync(dir)
      }

      if (content) {
        syncTaskList.push(fs.writeFile(path, content))
      }
    })

    Promise.all(syncTaskList).then(() =>
      logger.success(`[swet-cli] mock file generate successfully`)
    )

    // 将所有文档的路径和方法写一份存起来，mock 数据时需要使用
    const mockDataList = Object.values(this.swetParser.standardDataSource.controllers)
      .flat()
      .map(({ method, path }) => ({ method, path }))
    fs.writeFileSync(
      path.join(process.cwd(), mockDir, mockMethodPathFileName),
      JSON.stringify(mockDataList, null, 2)
    )
  }

  /**
   * 选择文档地址
   */
  private async selectDocumentUrl() {
    const sources = this.config.sources
    let selectedUrl = ''
    let enableSources = [] as { name: string; value: string }[]

    if (sources.length === 1) {
      if (isRemoteSource(sources[0])) {
        this.documentUrl = sources[0]
      } else {
        selectedUrl = checkFilePath(sources[0]) as string

        if (selectedUrl) {
          this.documentUrl = selectedUrl
        } else {
          logger.error(`[swet-cli] local path ${sources[0]} is not a file`)
        }
      }

      logger.info(sources[0])

      if (isObject(this.config.fetcher)) {
        logger.info(`[fetch headers]: ${JSON.stringify(this.config.fetcher)}`)
      }

      return
    }

    enableSources = sources
      .map(url => {
        if (isRemoteSource(url)) {
          return { name: url, value: url }
        }

        const absolutePath = checkFilePath(url)
        if (absolutePath) {
          return { name: url, value: absolutePath }
        } else {
          logger.warn(`[swet-cli] local path ${url} is not a file, skipped`)
        }
      })
      .filter(Boolean) as { name: string; value: string }[]

    this.documentUrl = await select('Which source would you like to choose?\n', enableSources)

    if (isObject(this.config.fetcher)) {
      logger.info(sources[0])
      logger.info(`[fetch headers]: ${JSON.stringify(this.config.fetcher)}`)
    }
  }

  /**
   * 获取 swet parser 实例
   */
  private async getParserInstance() {
    const { fetcher } = this.config
    // 加载文档数据
    const document = await loadDocument(this.documentUrl, fetcher)

    if (
      (!isArray(document) && !isObject(document)) ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (isObject(document) && !Object.keys((document as any).paths || {}).length)
    ) {
      logger.error(
        `[swet-cli] parser document failed, please try [curl ${this.documentUrl}] to check\n\n current data: ${document}}`
      )
    }

    // 获取实例
    this.swetParser = new SwetParser(document, this.config)
  }

  /**
   * 比较上一次代码产物和最新生成的区别
   */
  private comparePrevAndCurServices() {
    const { outDir } = this.config
    const fileDir = path.join(process.cwd(), outDir)
    const { controllers } = this.swetParser.standardDataSource

    const prevInfo = parsePrevServiceInfo(fileDir)
    const curInfo = Object.values(controllers).flat()

    if (!prevInfo?.length) return

    const info = curInfo
      .map(v => {
        const { path, method, name } = v
        const prevName = prevInfo.find(i => i.path + i.method === path + method)?.name

        if (prevName && prevName !== name) {
          return {
            path,
            method,
            prevName,
            currentName: name,
          }
        }
      })
      .filter(Boolean)

    return info
  }
}
