const path = require('path')
const { minimist, run, logger, removeSync, chalk } = require('@eljs/node-utils')

const { targets: allTargets, fuzzyMatchTarget, bin, runParallel } = require('./utils')

const args = minimist(process.argv.slice(2))
const targets = args._
const formats = args.formats || args.f
const devOnly = args.devOnly || args.d
const prodOnly = !devOnly && (args.prodOnly || args.p)
const sourceMap = args.sourcemap || args.s
const isRelease = args.release
const buildTypes = args.t || args.types || isRelease
const buildAllMatching = args.all || args.a

const step = message => {
  console.log()
  logger.step('Build', message)
}

main()

async function main() {
  if (isRelease) {
    // remove build cache for release builds to avoid outdated enum values
    removeSync(path.resolve(__dirname, '../node_modules/.rts2_cache'))
  }

  if (!targets.length) {
    await buildAll(allTargets)
  } else {
    await buildAll(fuzzyMatchTarget(targets, buildAllMatching))
  }
}

async function buildAll(targets) {
  await runParallel(require('os').cpus().length, targets, build)
}

async function build(target) {
  const pkgDir = path.resolve(`packages/${target}`)
  const { private, name, buildOptions, types } = require(`${pkgDir}/package.json`)

  // if this is a full build (no specific targets), ignore private packages.
  if ((isRelease || !targets.length) && private) {
    return
  }

  // if building a specific format, do not remove dist.
  if (!formats) {
    removeSync(`${pkgDir}/dist`)
  }

  const env = (buildOptions && buildOptions.env) || (devOnly ? 'development' : 'production')

  step(`Rolling up bundles for ${chalk.cyanBright.bold(name)}`)
  await run(bin('rollup'), [
    '-c',
    '--environment',
    [
      `NODE_ENV:${env}`,
      `TARGET:${target}`,
      formats ? `FORMATS:${formats}` : ``,
      buildTypes ? `TYPES:true` : ``,
      prodOnly ? `PROD_ONLY:true` : ``,
      sourceMap ? `SOURCE_MAP:true` : ``,
    ]
      .filter(Boolean)
      .join(','),
  ])

  // build types
  if (buildTypes && types) {
    console.log()
    step(`Rolling up type definitions for ${chalk.cyanBright.bold(name)}`)
    console.log()

    const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')

    const extractorConfigPath = path.resolve(pkgDir, `api-extractor.json`)
    const extractorConfig = ExtractorConfig.loadFileAndPrepare(extractorConfigPath)
    const extractorResult = Extractor.invoke(extractorConfig, {
      localBuild: true,
      showVerboseMessages: true,
    })

    if (!extractorResult.succeeded) {
      logger.printErrorAndExit(
        `API Extractor completed with ${extractorResult.errorCount} errors` +
          ` and ${extractorResult.warningCount} warnings.`
      )
    }

    removeSync(`${pkgDir}/dist/packages`)
  }

  console.log()
  logger.done(`Compiled ${chalk.cyanBright.bold(name)} successfully.`)
  console.log()
}
