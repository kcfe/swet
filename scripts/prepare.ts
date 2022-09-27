import 'zx/globals'
import { isLinux, isMac } from './utils'

prepare()

async function prepare(): Promise<void> {
  await $`husky install`

  if ((isLinux || isMac) && fs.existsSync(path.resolve(__dirname, '../.husky'))) {
    await $`chmod ug+x .husky/*`
  }
}
