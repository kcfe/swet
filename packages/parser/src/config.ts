import { SwetParserConfig } from './types'
import { CodeGenerator } from './generate/Generator'
import { Adapter } from './adapters'

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
