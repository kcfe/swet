// @ts-check
import path from 'path'
import ts from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { logger } from '@eljs/node-utils'

if (!process.env.TARGET) {
  logger.printErrorAndExit('TARGET package must be specified via --environment flag.')
}

const masterVersion = require('./package.json').version
const packagesDir = path.resolve(__dirname, 'packages')
const pkgDir = path.resolve(packagesDir, process.env.TARGET)
const pkg = require(resolve(`package.json`))
const packageOptions = pkg.buildOptions || {}
const name = packageOptions.filename || path.basename(pkgDir)

function resolve(p) {
  return path.resolve(pkgDir, p)
}

// ensure TS checks only once for each build
let hasTSChecked = false

const outputConfigs = {
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`,
  },
  esm: {
    file: resolve(`dist/${name}.esm.js`),
    format: `es`,
  },
}

const defaultFormats = ['cjs', 'esm']
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',')
const packageFormats = inlineFormats || packageOptions.formats || defaultFormats
const packageConfigs = process.env.PROD_ONLY
  ? []
  : packageFormats.map(format => createConfig(format, outputConfigs[format]))

if (process.env.NODE_ENV === 'production') {
  packageFormats.forEach(format => {
    if (packageOptions.prod === false) {
      return
    }
  })
}

export default packageConfigs

function createConfig(format, output, plugins = []) {
  if (!output) {
    logger.printErrorAndExit(`Invalid format: "${format}"`)
  }

  const isProductionBuild = process.env.__DEV__ === 'false'
  const isNodeBuild = format === 'cjs'
  const isESMBuild = format === 'esm'

  output.exports = 'named'
  output.sourcemap = !!process.env.SOURCE_MAP
  output.externalLiveBindings = false

  const shouldEmitDeclarations = pkg.types && process.env.TYPES != null && !hasTSChecked

  const tsPlugin = ts({
    check: process.env.NODE_ENV === 'production' && !hasTSChecked,
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: output.sourcemap,
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations,
      },
      exclude: ['**/__tests__'],
    },
  })
  // we only need to check TS and generate declarations once for each build.
  // it also seems to run into weird issues when checking multiple times
  // during a single build.
  hasTSChecked = true

  const entryFile = `src/index.ts`

  return {
    input: resolve(entryFile),
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      json({
        namedExports: false,
      }),
      tsPlugin,
      createReplacePlugin(isProductionBuild, isNodeBuild, isESMBuild),
      nodeResolve(),
      commonjs(),
      ...plugins,
    ],
    output,
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    },
    treeshake: {
      moduleSideEffects: false,
    },
    watch: {
      exclude: ['node_modules/**', 'dist/**'],
    },
  }
}

function createReplacePlugin(isProduction, isNodeBuild, isESMBuild) {
  const replacements = {
    __VERSION__: `"${masterVersion}"`,
    __DEV__: isESMBuild
      ? // preserve to be handled by bundlers
        `(process.env.NODE_ENV !== 'production')`
      : // hard coded dev/prod builds
        !isProduction,
    __NODE_JS__: isNodeBuild,
    __ESM__: isESMBuild,
  }

  // allow inline overrides like
  Object.keys(replacements).forEach(key => {
    if (key in process.env) {
      replacements[key] = process.env[key]
    }
  })

  return replace({
    // @ts-ignore
    values: replacements,
    preventAssignment: true,
  })
}
