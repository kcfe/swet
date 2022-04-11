const cp = require('child_process')
const path = require('path')
const { minimist, run, logger, chalk, removeSync } = require('@eljs/node-utils')

const { targets: allTargets, fuzzyMatchTarget, bin, runParallel } = require('./utils')

const args = minimist(process.argv.slice(2))
const targets = args._
const formats = args.formats || args.f
const buildTypes = args.t || args.types
const devAllMatching = args.all || args.a
const step = logger.step('Dev')

main()

async function main() {
  if (!targets.length) {
    await devAll(allTargets)
  } else {
    await devAll(fuzzyMatchTarget(targets, devAllMatching))
  }
}

async function devAll(targets) {
  await runParallel(require('os').cpus().length, targets, dev)
}

async function dev(target) {
  const pkgDir = path.resolve(`packages/${target}`)
  const pkg = require(`${pkgDir}/package.json`)

  if (pkg.private) {
    return
  }

  step(`Watching ${chalk.green.bold(pkg.name)}`)
  if (buildTypes) {
    const watch = cp.spawn(bin('rollup'), [
      '-c',
      '-w',
      '--environment',
      [`FORMATS:${formats || 'cjs'}`, `TARGET:${target}`, `TYPES:true`],
    ])

    watch.stdout.on('data', data => {
      console.log(data.toString())
      try {
        doBuildTypes()
      } catch (err) {}
    })

    watch.stderr.on('data', data => {
      console.log(data.toString())
      try {
        doBuildTypes()
      } catch (err) {}
    })

    function doBuildTypes() {
      if (buildTypes && pkg.types) {
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
    }
  } else {
    await run(bin('rollup'), [
      '-c',
      '-w',
      '--environment',
      [`FORMATS:${formats || 'cjs'}`, `TARGET:${target}`],
    ])
  }
}
