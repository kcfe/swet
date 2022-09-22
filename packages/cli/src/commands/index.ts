import { FileManager, Manager } from '../manager'

const fsManager = new FileManager()

/**
 * 初始化配置文件
 */
export function intiConfigFile() {
  fsManager.initConfigFile()
}

/**
 * 选择数据源
 */
export async function checkout() {
  const activeConfig = await fsManager.getActiveConfig()
  const manager = new Manager(activeConfig)

  manager.regenerateFiles()
}
