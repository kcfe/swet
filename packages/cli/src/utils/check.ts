/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path'
import fs from 'fs-extra'
import jscodeshift from 'jscodeshift'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parser = require('jscodeshift/parser/tsx')()

/**
 * 利用 jscodeshift 解析出文件内容的相关信息
 */
function jscodeshiftParse(source: string) {
  const info = [] as { name: string; path: string; method: string }[]

  try {
    jscodeshift(source, {
      parser,
    })
      .find(jscodeshift.ExportNamedDeclaration)
      .forEach(path => {
        if (path.node?.declaration?.type === 'FunctionDeclaration' && path.node.declaration.id) {
          const bodyLen = path.node.declaration.body.body.length
          const properties = (path.node.declaration.body.body[bodyLen - 2] as any).declarations[0]
            .init.argument.arguments[0].properties as any[]

          const name = path.node.declaration.id.name
          const urlObj = properties.find(v => v.key.name === 'url').value as Record<string, any[]>
          const method = properties.find(v => v.key.name === 'method').value.value
          let url = urlObj.quasis[0].value.raw

          // 拼接参数
          if (urlObj.expressions) {
            const suffix = urlObj.expressions.map(v => `{${v.property.name}}`).join('/')
            url += suffix
          }

          // 拼接剩下的参数
          const restQuasis = urlObj.quasis.slice(1)
          if (restQuasis) {
            const restUrl = restQuasis.map(v => v.value.raw).join('')
            url += restUrl
          }

          info.push({ name, path: url, method })
        }
      })
    // eslint-disable-next-line no-empty
  } catch (error) {}

  return info
}

/**
 * 获取文件夹下所有的文件路径
 */
function getFilePtahList(fileDir: string) {
  // 所有的需要解析的文件名称
  const filePathList: string[] = []

  if (!fs.existsSync(fileDir)) {
    return filePathList
  }

  const fileStats = fs.statSync(fileDir)

  // 判断是否是文件夹
  if (fileStats.isDirectory()) {
    fs.readdirSync(fileDir).forEach(fileName => {
      const dir = path.join(fileDir, fileName)
      filePathList.push(...getFilePtahList(dir))
    })
  } else {
    filePathList.push(fileDir)
  }

  return filePathList
}

/**
 * 解析之前所有的接口方法信息
 */
function parsePrevServiceInfo(fileDir: string) {
  if (!fs.existsSync(fileDir)) return

  // 获取所有的文件luj
  const filePathList = getFilePtahList(fileDir)

  // 读取所有的文件内容，仅读取以 ts 或者 js 结尾
  const fileSourceList: string[] = []
  filePathList.forEach(filePath => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.js')) {
      const source = fs.readFileSync(filePath, { encoding: 'utf-8' })
      fileSourceList.push(source)
    }
  })

  const prevInfo = fileSourceList.map(jscodeshiftParse).flat()

  return prevInfo
}

export { parsePrevServiceInfo }
