import React from 'react'
import { createModel } from 'hox'
import path from 'path'
import { is } from 'electron-util'
import sudo from 'sudo-prompt'

import { config } from '@shared/store'
import { sleep } from '@shared/utils'

const options = {
  name: 'HearthstoneBattlegroundsTools',
}
function exec(cmd: string) {
  return new Promise((resolve, reject) =>
    sudo.exec(cmd, options, (error, stdout, stderr) => {
      if (error) reject(error)
      else resolve({ stdout, stderr })
    })
  )
}

/**
 * 判断是否存在指定防火墙规则
 * @param ruleName
 * @param appPath
 */
async function hasRule(ruleName: string) {
  try {
    if (is.windows) {
      await exec(`netsh advfirewall firewall show rule name="${ruleName}" >nul`)
    }

    return true
  } catch (_) {
    return false
  }
}
/**
 * 添加防火墙规则
 * @param ruleName
 * @param appPath
 * @param cb
 */
async function addRule(
  ruleName: string,
  appPath: string,
  cb: (title: string) => void
) {
  try {
    if (is.windows) {
      await exec(
        `netsh advfirewall firewall add rule name="${ruleName}"  dir=out  program="${appPath}" action=block`
      )
    }

    cb(`防火墙规则 ${ruleName} 添加成功`)
    return true
  } catch (_) {
    cb(`防火墙规则添加失败 请检查是否具有[管理员权限]`)
    return false
  }
}
/**
 * 开启防火墙规则
 * @param ruleName
 * @param appPath
 * @param cb
 */
async function enableRule(
  ruleName: string,
  appPath: string,
  cb: (title: string) => void
) {
  try {
    if (is.windows) {
      await exec(
        `netsh advfirewall firewall set rule name="${ruleName}" new program="${appPath}" enable=yes`
      )
    }
    if (is.macos) {
      await exec(
        `echo "block all" >> /etc/hs_unplug.conf && pfctl -f /etc/hs_unplug.conf 2>/dev/null && pfctl -e 2>/dev/null`
      )
    }
    cb('防火墙规则已经生效 等待恢复')
    return true
  } catch (_) {
    cb('防火墙规则添加失败 请检查是否具有[管理员权限]')
    return false
  }
}
/**
 * 关闭防火墙规则
 * @param ruleName
 * @param appPath
 * @param cb
 */
async function disableRule(ruleName: string, cb: (title: string) => void) {
  try {
    if (is.windows) {
      await exec(
        `netsh advfirewall firewall set rule name="${ruleName}" new enable=no`
      )
    }
    if (is.macos) {
      await exec(`pfctl -d 2>/dev/null && pfctl -f /etc/pf.conf 2>/dev/null`)
    }
    cb('恢复炉石网络成功')
    return true
  } catch (_) {
    cb('防火墙规则恢复失败 请检查是否具有[管理员权限]')
    return false
  }
}

const appDirPath = config.get('heartstoneRootPath') as string
const shortcut = (config.get('shortcuts.unplug') as string) ?? 'F1'
const defaultText = `一键拔线 (快捷键 ${shortcut})`
const appName = is.windows
  ? 'Hearthstone.exe'
  : is.macos
  ? 'Hearthstone.app'
  : ''
// 游戏路径
const appPath = path.join(appDirPath, appName)
// 断线时间
const timeOut = 5
const ruleName = 'HBT炉石拔线'

function useUnplug() {
  const [loading, toggleLoading] = React.useState(false)
  const [completed, toggleCompleted] = React.useState(true)
  const [tooltip, setTooltip] = React.useState<string>(defaultText)

  const handleUnplug = async () => {
    if (!loading) {
      toggleLoading(true)
      toggleCompleted(false)
      if (is.windows) {
        setTooltip('正在检查是否存在防火墙规则')
        const has = await hasRule(ruleName)
        if (has) {
          // 存在指定规则
          setTooltip('防火墙规则已存在')
        } else {
          // 不存在指定规则 添加
          setTooltip('正在添加防火墙规则')
          await addRule(ruleName, appPath, setTooltip)
        }

        // 启用防火墙规则
        setTooltip('正在启用防火墙规则')
        await enableRule(ruleName, appPath, setTooltip)

        await sleep(timeOut * 1000)
        await disableRule(ruleName, setTooltip)
      }
      if (is.macos) {
        setTooltip('正在启用防火墙')
        await enableRule(ruleName, appPath, setTooltip)

        await sleep(timeOut * 1000)
        await disableRule(ruleName, setTooltip)
      }

      await sleep(3000)
      setTooltip(defaultText)
      toggleLoading(false)

      await sleep(10000)
      // 拔线完成后 10s 内不记录战绩
      toggleCompleted(true)
    }
  }

  return {
    loading,
    completed,
    tooltip,
    unplug: handleUnplug,
  }
}

export default createModel(useUnplug)
