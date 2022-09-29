<div align="center">

<img width="100" src="https://ali-ad.a.yximgs.com/udata/pkg/ks-ad-fe/swet-cli/swet.png" alt="swet logo">

# **swet**

<p>swet(发音 /swēt/，取自于 sweet) 是前端开发的提效工具，通过接口文档说明数据自动生成前端接口层代码</P>

</div>

## ✨ 特性

- **多语言支持** 默认支持 `typescript`、`javascript` 项目，也支持拓展其他语言写法
- **适配多种数据类型** 适配 `swagger2`、`swagger3` 文档数据类型，也可定制解析器适配其他数据类型
- **无障碍接入** 无论新旧项目都没有接入成本，对于生成的代码不使用的部分对项目完全没有副作用
- **配套开发** 根据接口文档一站式配套生成 `ts` 类型定义、mock 数据可在开发中直接接入使用

## 📦 开始

1、项目下安装 `@swet/cli` 工具包

```bash
# 选择一个你喜欢的包管理器

# npm
$ npm i @swet/cli -D

# pnpm
$ pnpm i @swet/cli -D

# yarn
$ yarn add @swet/cli -D
```

2、package.json 下准备脚本命令

```json
 "scripts": {
     "swet": "swet co",
 }
```

3、项目下运行 `npm run swet` 命令，按照提示继续即可

## 🔨 配置项

```ts
interface SwetCliConfig {
  /**
   * 接口文档地址列表，可以是远程路径也可以是本地路径
   */
  sources: string[]
  /**
   * 生成代码的存放路径，使用相对路径即可；
   * 默认值：src/apis
   */
  outDir?: string
  /**
   * 生成代码的语言模版
   * 默认值：判段项目目录下是否有 tsconfig.json || tsconfig.base.json
   */
  language?: 'js' | 'ts'
  /**
   * 数据源名称，多数据源的通过制度数据源名称便于区分选择；
   * 默认值：数据源+index
   */
  name?: string
  /**
   * 参数是否可选生成规则
   * 默认值：pureInfer
   */
  parameterMode?: 'strict' | 'loose' | 'strictInfer' | 'looseInfer' | 'pureInfer'
  /**
   * 自定义生成类型名称前缀
   * eg: Props => IProps
   */
  interfacePrefix?: string
  /**
   * prettier 代码格式化配置项
   * 默认值：['.prettierrc', 'prettier.config.js', '.prettierrc.js']读取项目下第首先读取到的配置文件
   */
  prettierConfig?: Record<string, any>
  /**
   * 自定义获取文档的方法或补充 headers 信息
   */
  fetcher?: Record<string, any> | (() => Document)
  /**
   * 对 service 默认模版自定义拓展
   */
  transfromService?: (info: ServiceInfomation) => {
    /** 自定义生成方法名 */
    name?: string
    /** 添加 headers */
    headers?: Record<string, any>
    /** 添加统一的路径前缀 */
    baseUrl?: string
  }
  /**
   * 对 controller 文件进行自定义拓展
   */
  transformController?: (controllerName: string) => {
    /** 添加在 controller file 头部代码 */
    leadingCode?: string
    /** 添加在 controller file 尾部代码 */
    trailingCode?: string
    /**
     * 自定义 controller file name
     * 默认值：controllerName
     */
    fileName?: string
  }
  /**
   * 数据代理能力配置
   */
  mocks?: {
    /** mock 数据存放目录，不指定则不会生成 mock 数据 */
    output?: string
    /** 需要转发的接口统一前缀 */
    forwardUrl?: string
    /** proxy 代理配置项，详情可见 http-proxy-middleware */
    httpProxy?: Options
    /** 代理过滤规则 */
    filterProxy?: (req: Request) => boolean
    /** 自定义转换 mock 数据，可用于补充特征值 */
    transformer?: (data: any, serviceInfo: ServiceInformation) => string
  }
  /**
   * 数据格式转换适配器
   * 默认值：根据文档关键信息自动选择已经默认集成的适配器
   */
  Adapter?: typeof Adapter
  /**
   * 代码模版生成器
   * 可以通过复写方法自定义代码模版
   */
  CodeGenerator?: typeof CodeGenerator
}
```

## ❓ 常见问题

1、如何在项目中接入多份文档？

```ts
import { SwetCliConfig } from '@swet/cli'

export const swet: SwetCliConfig[] = [
  {
    source: ['xxx'],
    outDir: './src/apis-1',
  },
  {
    source: ['xxx'],
    outDir: './src/apis-1',
  },
]
```

2、mock 如何使用？mocks 配置项说明？

- 如果在开发过程中完全使用请求 proxy，那么可能不需要了解此配置项
- 如果想使用 mock 数据或者 mock、proxy 同时使用将可以使用此配置项 [demo](https://github.com/kcfe/swet/blob/master/examples/mocks-config.ts)

  - 首先将 swet 提供的 `webpack dev server` 中间件挂载

  ```ts
  import { swetMockMiddleware } from '@swet/cli'

  module.exports = {
  //...
  devServer: {
    onBeforeSetupMiddleware: function (devServer) {
      swetMockMiddle(devServer.app)
    }
  }
  ```

  - 剩余配置项说明

    - output: mock 数据的存放目录
    - forwardUrl: 需要 middleware 转发的接口统一前缀
    - httpProxy: 若有此配置项将会走 proxy 方式，没有则走本地 mock，此配置项详情可见 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware#readme)
    - filterProxy: 在配置了 httpProxy 使用 proxy 的情况下，可以通过此配置项将请求过滤，不走 proxy 从而使用本地 mock
    - transformer: 自定义转换生成的 mock 数据，可用于补充返回数据特征值

  - mock 数据寻找规则说明

    - 以 mock 数据存放目录为 `./mock`， 请求路径 `/rest/dsp/agent/info`，请求方法 `post` 为例
    - 首先会寻找项目目录下 `mock/rest/dsp/agent/info/post.js` 文件夹下的数据
    - 在上一步寻找文件数据失败的情况下则会寻找 swet 默认生成的 mock 数据，也就是 `mock/__mock_data_generate_by_swet__/rest/dsp/agent/info/post.js` 文件夹下的数据

## 📄 LICENSE

[MIT](https://github.com/kcfe/swet/blob/master/LICENSE)
