import { Adapter } from './adapters'
import { CodeGenerator } from './generate/Generator'
import { SwetParserConfig } from './types'

/**
 * 默认配置项
 */
export const defaultParserConfig: SwetParserConfig = {
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
  Adapter,
  CodeGenerator,
}
