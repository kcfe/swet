/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path'
import fs from 'fs-extra'
import mockjs from 'mockjs'
import { isFunction } from '@swet/parser'
import { getSwetCliConfig, logger } from '.'
import { SwetCliConfigRequired } from '../types'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { defaultMockDir, mockMethodPathFileName } from '../config'
import { Application, NextFunction, Request, RequestHandler, Response } from 'express'

/**
 * 处理 mock
 * @param req
 * @param config
 */
function handlerMock(req: Request, config: SwetCliConfigRequired) {
  try {
    const { mocks } = config
    const mockDir = mocks.output

    if (!mockDir) return

    // 接口路径加方法拼接成的文件路径
    const ownerPath = path.join(req.originalUrl.split('?')[0], `/${req.method.toLowerCase()}.js`)
    let userMockFilePath = path.join(process.cwd(), mockDir, ownerPath)
    let swetMockFilePath = path.join(process.cwd(), mockDir, defaultMockDir, ownerPath)

    // 不存在用户自己手写的 mock 数据
    if (!fs.existsSync(userMockFilePath)) {
      // 读取路径加方法的原始信息
      const mockMethodPath = path.join(process.cwd(), mockDir, mockMethodPathFileName)
      let originalList = [] as { method: string; path: string }[]

      try {
        originalList = fs.readJSONSync(mockMethodPath)
      } catch (error) {}

      const regExpList = originalList.map(v => ({
        url: v.path,
        regExpFunc: (url: string) => {
          const spliceUrl = v.path
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const reg = spliceUrl?.replace(/{.+?}/g, $1 => {
            return `.+`
          })
          const urlLen = url?.split('/')?.length
          const spliceUrlLen = spliceUrl?.split('/')?.length
          if (url.match(new RegExp(`^${reg}$`)) && urlLen === spliceUrlLen) {
            return true
          }
          return false
        },
      }))

      // 原始路径 /rest/info/{id}
      const queryUrl = req.originalUrl.split('?')[0]
      const originalUrl = regExpList.find(v => v.regExpFunc(queryUrl))?.url

      if (originalUrl) {
        userMockFilePath = path.join(
          process.cwd(),
          mockDir,
          originalUrl,
          `/${req.method.toLowerCase()}.js`
        )

        if (!fs.existsSync(swetMockFilePath)) {
          swetMockFilePath = path.join(
            process.cwd(),
            mockDir,
            defaultMockDir,
            originalUrl,
            `/${req.method.toLowerCase()}.js`
          )
        }
      }
    }

    // 再次判断是否存在用户手写 mock 文件
    if (fs.existsSync(userMockFilePath)) {
      if (require.cache[userMockFilePath]) {
        delete require.cache[userMockFilePath]
      }
      const data = require(userMockFilePath)
      const result = isFunction(data) ? data(req) : data
      return result
    }

    // 不存在用户手写 mock 文件，在默认生成的 mock 文件中查找
    if (fs.existsSync(swetMockFilePath)) {
      if (require.cache[swetMockFilePath]) {
        delete require.cache[swetMockFilePath]
      }
      const data = require(swetMockFilePath)
      const result = isFunction(data) ? data(req) : data
      return result
    }
  } catch (error) {}
}

function handlerFunction(req: Request, res: Response, swetCliConfigs?: SwetCliConfigRequired[]) {
  if (!swetCliConfigs) {
    swetCliConfigs = getSwetCliConfig() || []
  }

  const url = req.originalUrl?.split('?')[0]
  res.header('swet-cli-middleware', url)

  const notFoundRes = {
    data: `[swet-cli-middleware][${url}] no mock data found`,
    result: -1,
    status: 404,
    code: -1,
  }

  let responseData = undefined

  try {
    // 没有找到对应的 config, 遍历 config 寻找 mock 数据
    for (const config of swetCliConfigs) {
      responseData = handlerMock(req, config)

      if (responseData) {
        return res.json(mockjs.mock(responseData))
      }
    }
    res.json(notFoundRes)
    return logger.warn(`[swet-mock-middleware][${url}] no mock data found`)
  } catch (error) {
    res.json(responseData || notFoundRes)

    if (!responseData) {
      logger.warn(`[swet-mock-middleware][${url}] no mock data found`)
    }
  }
}

function swetMockHandler(
  config: SwetCliConfigRequired,
  req: Request,
  res: Response,
  next: NextFunction,
  proxyInstance: RequestHandler,
  swetCliConfigs: SwetCliConfigRequired[]
) {
  const {
    mocks: { filterProxy, httpProxy },
  } = config

  // 没有 httpProxy 或者需要过滤掉 proxy 则默认认为需要使用 mock
  if (!httpProxy || filterProxy?.(req)) {
    return handlerFunction(req, res, swetCliConfigs)
  }

  return proxyInstance?.(req, res, next)
}

function swetMockMiddleware(app: Application) {
  const map = new Map()
  const swetCliConfigs = (getSwetCliConfig() || []).filter(
    v => v.mocks?.forwardUrl
  ) as SwetCliConfigRequired[]

  swetCliConfigs.forEach(v => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    app.use(v.mocks!.forwardUrl!, (req, res, next) => {
      let proxyInstance = map.get(v)

      if (!proxyInstance && v.mocks?.httpProxy) {
        proxyInstance = createProxyMiddleware(v.mocks.httpProxy)
        map.set(v, proxyInstance)
      }

      swetMockHandler(v, req, res, next, proxyInstance, swetCliConfigs)
    })
  })
}

swetMockMiddleware.handlerFunction = handlerFunction

export { swetMockMiddleware }
