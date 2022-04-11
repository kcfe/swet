// create package.json, README, etc. for packages that don't have them yet.

const fs = require('fs')
const path = require('path')
const { minimist, isDirectory, logger, chalk } = require('@eljs/node-utils')

const args = minimist(process.argv.slice(2))
const version = require('../package.json').version

const packagesDir = path.resolve(__dirname, '../packages')
const files = fs.readdirSync(packagesDir)

const step = logger.step('Bootstrap')

files.forEach(shortName => {
  if (!isDirectory(path.join(packagesDir, shortName))) {
    return
  }

  const name = `@swet/${shortName}`
  step(`Initializing ${chalk.cyanBright.bold(name)}`)
  console.log()

  ensurePkgJson(name, shortName)
  ensureReadme(name, shortName)
  ensureSrcIndex(shortName)
  ensureRootIndex(shortName)
  ensureApiExtractorConfig(shortName)
})

function ensurePkgJson(name, shortName) {
  const pkgJSONPath = path.join(packagesDir, shortName, `package.json`)
  const pkgJSONExists = fs.existsSync(pkgJSONPath)

  if (pkgJSONExists) {
    const pkg = require(pkgJSONPath)

    if (pkg.private) {
      return
    }
  }

  if (args.force || !pkgJSONExists) {
    const json = {
      name,
      version,
      description: name,
      keywords: [shortName],
      main: 'index.js',
      types: `dist/${shortName}.d.ts`,
      module: `dist/${shortName}.esm.js`,
      files: [`index.js`, `dist`],
      repository: {
        type: 'git',
        url: '',
      },
      homepage: `https://///tree/master/packages/${shortName}#readme`,
      bugs: {
        url: 'https://///issues',
      },
      author: 'liquan',
      license: 'MIT',
    }

    if (pkgJSONExists) {
      const pkg = require(pkgJSONPath)
      ;[
        'dependencies',
        'devDependencies',
        'peerDependencies',
        'files',
        'author',
        'types',
        'sideEffects',
        'main',
        'module',
      ].forEach(key => {
        if (pkg[key]) {
          json[key] = pkg[key]
        }
      })
    }

    fs.writeFileSync(pkgJSONPath, JSON.stringify(json, null, 2))
  }
}

function ensureReadme(name, shortName) {
  const readmePath = path.join(packagesDir, shortName, `README.md`)

  if (args.force || !fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, `# ${name}`)
  }
}

function ensureSrcIndex(shortName) {
  const srcDir = path.join(packagesDir, shortName, `src`)
  const indexPath = path.join(packagesDir, shortName, `src/index.ts`)

  if (args.force || !fs.existsSync(indexPath)) {
    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir)
    }

    fs.writeFileSync(indexPath, ``)
  }
}

function ensureRootIndex(shortName) {
  const rootIndexPath = path.join(packagesDir, shortName, 'index.js')

  if (args.force || !fs.existsSync(rootIndexPath)) {
    fs.writeFileSync(
      rootIndexPath,
      `
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/${shortName}.cjs.prod.js')
} else {
  module.exports = require('./dist/${shortName}.cjs.js')
}
    `.trim() + '\n'
    )
  }
}

function ensureApiExtractorConfig(shortName) {
  const apiExtractorConfigPath = path.join(packagesDir, shortName, `api-extractor.json`)

  if (args.force || !fs.existsSync(apiExtractorConfigPath)) {
    fs.writeFileSync(
      apiExtractorConfigPath,
      `
{
  "extends": "../../api-extractor.json",
  "mainEntryPointFilePath": "./dist/packages/<unscopedPackageName>/src/index.d.ts",
  "dtsRollup": {
    "publicTrimmedFilePath": "./dist/<unscopedPackageName>.d.ts"
  }
}
`.trim()
    )
  }
}
