/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { SwetCliConfig } from '@swet/cli'

export const swet: SwetCliConfig = {
  mocks: {
    /**
     * mock 输出数据的存放目录
     */
    output: './mock',
    /**
     * 转发 /rest 路径前缀的请求
     */
    forwardUrl: '/rest',
    /**
     * proxy 代理配置
     */
    httpProxy: {
      target: 'http:www.test.com',
      headers: {
        cookie: 'dawdnhoiuaDn;oanmdlamfl;smfls;mfl;sf',
      },
    },
    /**
     * 过滤 proxy 请求，走本地 mock 数据
     */
    filterProxy: (req: Request) => {
      /**
       * 过滤所有请求路径包含 /userInfo 或者 /ownerAuth 的请求
       */
      if (req.url.includes('/userInfo') || req.url.includes('/ownerAuth')) return true
      /**
       * 过滤所有的 post 请求
       */
      if (req.method.toLowerCase() === 'post') return true

      /**
       * 其他请求正常通过 proxy 获取
       */
      return false
    },
    /**
     * 为 mock 数据补充特征值
     */
    transformer: () => {
      if (data && typeof data === 'object') {
        data.result = '1'
        data.errorMsg = 'mock 请求失败'
      }

      return `module.exports = () => (${JSON.stringify(data, null, 2)})`
    },
  },
}
