# @swet/cli

swet cli

## 快速开始

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

## 配置项

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
