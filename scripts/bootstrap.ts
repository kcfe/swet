/* eslint-disable @typescript-eslint/no-var-requires */
// create package.json, README, etc. for packages that don't have them yet.

import path from 'path'
import { argv, chalk, fs } from 'zx'
import { logger } from './logger'
import { isDirectory } from './utils'

const step = logger.step('Bootstrap')
const version = require('../package.json').version

const packagesDir = path.resolve(__dirname, '../packages')
let files = fs.readdirSync(packagesDir)

if (argv._.length) {
  files = argv._
}

files.forEach(shortName => {
  if (!isDirectory(path.join(packagesDir, shortName))) {
    return
  }

  const name = `@swet/${shortName}`
  step(`Initializing ${chalk.cyanBright.bold(name)}`)
  console.log()

  ensurePkgJSON(name, shortName)
  ensureReadme(name, shortName)
  ensureSrcIndex(shortName)
  ensureFatherrc(shortName)
})

function ensurePkgJSON(name: string, shortName: string): void {
  const pkgJSONPath = path.join(packagesDir, shortName, `package.json`)
  const pkgJSONExists = fs.existsSync(pkgJSONPath)

  if (pkgJSONExists) {
    const pkg = require(pkgJSONPath)

    if (pkg.private) {
      return
    }
  }

  if (argv.force || !pkgJSONExists) {
    const json = {
      name,
      version,
      description: name,
      keywords: ['swet', shortName],
      homepage: `https://github.com/kcfe/swettree/master/packages/${shortName}#readme`,
      bugs: {
        url: 'https://github.com/kcfe/swet/issues',
      },
      repository: {
        type: 'git',
        url: 'https://github.com/kcfe/swet',
      },
      license: 'MIT',
      author: 'KCFE',
      main: `lib/index.js`,
      types: `lib/index.d.ts`,
      files: ['lib'],
      scripts: {
        build: 'father build',
        clean: 'rimraf lib',
        dev: 'father dev',
      },
    }

    if (pkgJSONExists) {
      const pkg = require(pkgJSONPath)
      ;[
        'description',
        'keywords',
        'author',
        'sideEffects',
        'main',
        'types',
        'files',
        'scripts',
        'dependencies',
        'devDependencies',
        'peerDependencies',
      ].forEach(key => {
        if (pkg[key]) {
          json[key] = pkg[key]
        }
      })
    }

    fs.writeFileSync(pkgJSONPath, JSON.stringify(json, null, 2))
  }
}

function ensureReadme(name: string, shortName: string): void {
  const readmePath = path.join(packagesDir, shortName, `README.md`)

  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(
      readmePath,
      `
# ${name}

swet ${shortName}

## 快速开始

### 1. 安装

\`\`\`bash
$ npm i ${name} -S
// or
$ yarn add ${name}
// or
$ pnpm add ${name}
\`\`\`

### 2. 使用

\`\`\`ts
import ${shortName} from '${name}'
\`\`\`

## API


## 开发

\`\`\`bash
$ pnpm dev --filter ${name}
// or
$ pnpm -F '${name}' dev
\`\`\`

## 发布

### 1. [语义化提交 Commit](https://www.conventionalcommits.org/en/v1.0.0/#summary) 

\`\`\`bash
$ git commit -m 'feat(${shortName}): add some feature'
$ git commit -m 'fix(${shortName}): fix some bug'
\`\`\`

### 2. 编译（可选）

\`\`\`bash
$ pnpm build --filter ${name}
// or
$ pnpm -F '${name}' build
\`\`\`

### 3. 执行发包命令

\`\`\`bash
$ pnpm release

Options:
  --skipTests skip package test
  --skipBuild skip package build
\`\`\`
  `.trim() + '\n',
    )
  }
}

function ensureSrcIndex(shortName: string): void {
  const srcDir = path.join(packagesDir, shortName, `src`)
  const indexPath = path.join(packagesDir, shortName, `src/index.ts`)

  if (!fs.existsSync(indexPath)) {
    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir)
    }

    fs.writeFileSync(
      indexPath,
      `
export {}
  `.trim() + '\n',
    )
  }
}

function ensureFatherrc(shortName: string): void {
  const fatherrcPath = path.join(packagesDir, shortName, `.fatherrc.ts`)

  if (!fs.existsSync(fatherrcPath)) {
    fs.writeFileSync(
      fatherrcPath,
      `
import { defineConfig } from 'father'

export default defineConfig({
  extends: '../../.fatherrc.base.ts',
})
  `.trim() + '\n',
    )
  }
}
