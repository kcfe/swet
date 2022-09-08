import path from 'path'
import { fs } from 'zx'
import { logger } from './logger'

export const targets = fs.readdirSync('packages').filter(file => {
  if (!isDirectory(`packages/${file}`)) {
    return false
  }

  const pkgJSONPath = path.resolve(
    __dirname,
    `../packages/${file}/package.json`,
  )

  if (!fs.existsSync(pkgJSONPath)) {
    return false
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkg = require(pkgJSONPath)

  if (pkg.private) {
    return false
  }

  return true
})

export function isDirectory(file: string): boolean {
  const stats = fs.statSync(file)
  return stats.isDirectory()
}

export function assert(v: unknown, message: string) {
  if (!v) {
    logger.printErrorAndExit(message)
  }
}
