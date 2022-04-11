const path = require('path')
const fs = require('fs')
const { isDirectory, logger } = require('@eljs/node-utils')

const targets = fs.readdirSync('packages').filter(file => {
  if (!isDirectory(`packages/${file}`)) {
    return false
  }

  const pkg = require(`../packages/${file}/package.json`)

  if (pkg.private) {
    return false
  }

  return true
})

function fuzzyMatchTarget(partialTargets, includeAllMatching) {
  const matched = []

  partialTargets.forEach(partialTarget => {
    for (const target of targets) {
      if (target.match(partialTarget)) {
        matched.push(target)
        if (!includeAllMatching) {
          break
        }
      }
    }
  })

  if (matched.length) {
    return matched
  } else {
    logger.printErrorAndExit(`Target ${chalk.underline(partialTargets)} not found!`)
  }
}

function bin(name) {
  return path.resolve(__dirname, '../node_modules/.bin/' + name)
}

async function runParallel(maxConcurrency, source, iteratorFn) {
  const ret = []
  const executing = []

  for (const item of source) {
    const p = Promise.resolve().then(() => iteratorFn(item, source))
    ret.push(p)

    if (maxConcurrency <= source.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)

      if (executing.length >= maxConcurrency) {
        await Promise.race(executing)
      }
    }
  }

  return Promise.all(ret)
}

module.exports = {
  targets,
  fuzzyMatchTarget,
  bin,
  runParallel,
}
