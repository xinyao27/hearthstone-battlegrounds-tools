import React from 'react';
import { createModel } from 'hox';
import path from 'path';
import { is } from 'electron-util';
import { exec as execBase } from 'child_process';
import { promisify } from 'util';

import { config } from '@shared/store';

const exec = promisify(execBase);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 判断是否存在指定防火墙规则
 * @param ruleName
 * @param appPath
 */
async function hasRule(ruleName: string, appPath: string) {
  try {
    if (is.windows) {
      await exec(
        `netsh advfirewall firewall show rule name="${ruleName}" >nul`
      );
    }
    if (is.macos) {
      const { stderr, stdout } = await exec(
        `/usr/libexec/ApplicationFirewall/socketfilterfw --getappblocked ${appPath}`
      );
      if (stderr) {
        throw stderr;
      }
      if (stdout.includes('The file path you specified does not exist')) {
        return false;
      }
    }

    return true;
  } catch (_) {
    return false;
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
      );
    }
    if (is.macos) {
      await exec(
        `/usr/libexec/ApplicationFirewall/socketfilterfw --add ${appPath}`
      );
    }
    cb(`防火墙规则 ${ruleName} 添加成功`);
    return true;
  } catch (_) {
    cb(`防火墙规则添加失败 请检查是否具有[管理员权限]`);
    return false;
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
      );
    }
    if (is.macos) {
      await exec(
        `/usr/libexec/ApplicationFirewall/socketfilterfw --blockapp ${appPath}`
      );
    }
    cb('防火墙规则已经生效 等待恢复');
    return true;
  } catch (_) {
    cb('防火墙规则添加失败 请检查是否具有[管理员权限]');
    return false;
  }
}
/**
 * 关闭防火墙规则
 * @param ruleName
 * @param appPath
 * @param cb
 */
async function disableRule(
  ruleName: string,
  appPath: string,
  cb: (title: string) => void
) {
  try {
    if (is.windows) {
      await exec(
        `netsh advfirewall firewall set rule name="${ruleName}" new enable=no`
      );
    }
    if (is.macos) {
      await exec(
        `/usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp ${appPath}`
      );
    }
    cb('恢复炉石网络成功');
    return true;
  } catch (_) {
    cb('防火墙规则恢复失败 请检查是否具有[管理员权限]');
    return false;
  }
}

const appDirPath = config.get('heartstoneRootPath') as string;
const shortcut = (config.get('shortcuts.unplug') as string) ?? 'F1';
const defaultText = `一键拔线 (快捷键 ${shortcut})`;
const appName = is.windows
  ? 'Hearthstone.exe'
  : is.macos
  ? 'Hearthstone.app'
  : '';
// 游戏路径
const appPath = path.join(appDirPath, appName);
// 断线时间
const timeOut = 5;
const ruleName = 'HBT炉石拔线';

function useUnplug() {
  const [loading, toggleLoading] = React.useState(false);
  const [completed, toggleCompleted] = React.useState(true);
  const [tooltip, setTooltip] = React.useState<string>(defaultText);

  const handleUnplug = async () => {
    if (!loading) {
      toggleLoading(true);
      toggleCompleted(false);
      setTooltip('正在检查是否存在防火墙规则');
      const has = await hasRule(ruleName, appPath);
      if (has) {
        // 存在指定规则
        setTooltip('防火墙规则已存在');
      } else {
        // 不存在指定规则 添加
        setTooltip('正在添加防火墙规则');
        await addRule(ruleName, appPath, setTooltip);
      }

      // 启用防火墙规则
      setTooltip('正在启用防火墙规则');
      await enableRule(ruleName, appPath, setTooltip);

      await sleep(timeOut * 1000);
      await disableRule(ruleName, appPath, setTooltip);

      await sleep(3000);
      setTooltip(defaultText);
      toggleLoading(false);

      await sleep(10000);
      // 拔线完成后 10s 内不记录战绩
      toggleCompleted(true);
    }
  };

  return {
    loading,
    completed,
    tooltip,
    unplug: handleUnplug,
  };
}

export default createModel(useUnplug);
