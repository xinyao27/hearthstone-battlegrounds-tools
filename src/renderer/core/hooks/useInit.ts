import React from 'react'
import { createModel } from 'hox'
import { useBoolean } from 'ahooks'
import { is } from 'electron-util'
import { promises as fsPromises } from 'fs'

import { config, getStore } from '@shared/store'
import { Topic } from '@shared/constants/topic'
import resetGame from '@renderer/core/pages/settings/resetGame'

function useInit(): [boolean, { check: () => Promise<boolean> }] {
  const store = getStore()
  const [correctDirectory, { toggle: setCorrectDirectory }] = useBoolean(true)
  const check = React.useCallback(async () => {
    try {
      // 检测默认炉石路径是否正确
      const heartstoneRootPath = config.get('heartstoneRootPath') as string
      const stats = await fsPromises.stat(heartstoneRootPath)
      const items = stats.isDirectory()
        ? (await fsPromises.readdir(heartstoneRootPath)) || []
        : []
      const result = items.some((item) => {
        if (is.windows) {
          return (
            item === 'Hearthstone.exe' ||
            item === 'Hearthstone Beta Launcher.exe'
          )
        }
        if (is.macos) {
          return (
            item === 'Hearthstone.app' ||
            item === 'Hearthstone Beta Launcher.app'
          )
        }
        return false
      })
      // 如果是合法目录开始监控 Logs
      if (result) {
        store.dispatch<Topic.START_WATCH>({
          type: Topic.START_WATCH,
        })
        // 重置一次炉石配置 保证日志监控正常运行
        await resetGame()
      }
      setCorrectDirectory(result)
      return result
    } catch (_) {
      setCorrectDirectory(false)
      return false
    }
  }, [setCorrectDirectory, store])

  return [correctDirectory, { check }]
}

export default createModel(useInit)
