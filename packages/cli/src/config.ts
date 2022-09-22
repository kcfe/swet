import { SwetCliConfig } from './types'
import { SwetCliAdapter, SwetCliCodeGenerator } from './utils/parser'

/**
 * swet-cli 配置文件类型
 */
export const swetConfigFileType = ['typescript', 'javascript']

/**
 * swet-cli 配置文件名称
 */
export const swetConfigFileNames = ['swet.config.ts', 'swet.config.js']

/**
 * prettier 格式化代码配置文件名称
 */
export const prettierConfigFileNames = ['.prettierrc', 'prettier.config.js', '.prettierrc.js']

/**
 * 默认 mock 数据文件夹
 */
export const defaultMockDir = '__mock_data_generate_by_swet__'

/**
 * mock 接口 method path 存放文件名称
 */
export const mockMethodPathFileName = 'mock-method-path.json'

/**
 * swet-cli 默认配置项
 */
export const defaultSwetCliConfig: SwetCliConfig = {
  sources: [],
  interfacePrefix: '',
  outDir: './src/apis',
  prettierConfig: {
    printWidth: 100,
    singleQuote: true,
    tabWidth: 2,
    semi: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    proseWrap: 'never',
    arrowParens: 'avoid',
    parser: 'typescript',
  },
  parameterMode: 'pureInfer',
  mocks: {
    httpProxy: {
      changeOrigin: true,
      secure: false,
    },
    transformer: data => {
      if (data && typeof data === 'object') {
        data.result = 1
        data.errorMsg = '请求失败，请稍后再试...'
      }

      return `module.exports = () => (${JSON.stringify(data, null, 2)})`
    },
  },
  transformController: () => ({
    leadingCode: `import axios from 'axios'`,
  }),
  Adapter: SwetCliAdapter,
  CodeGenerator: SwetCliCodeGenerator,
}
