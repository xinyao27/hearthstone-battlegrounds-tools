import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import path from 'path';
import { is } from 'electron-util';
import { remote } from 'electron';
import { exec as execBase } from 'child_process';
import { promisify } from 'util';
import { useBoolean, useMount } from 'ahooks';
import clsx from 'clsx';

import { config } from '@shared/store';

import Loading from './Loading';

const exec = promisify(execBase);

/**
 * 判断是否存在指定防火墙规则
 * windows
 * @param ruleName
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

const useStyles = makeStyles((theme) => ({
  root: {
    width: 80,
    height: 52,
    position: 'absolute',
    top: 32,
    left: '50%',
    zIndex: 2,
    transform: 'translateX(-50%)',
    background: `url('${
      require('@shared/assets/images/unplug_bg.png').default
    }') no-repeat`,
    backgroundSize: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: `all ${theme.transitions.easing.sharp} ${theme.transitions.duration.shortest}ms`,
    '&:hover': {
      top: 58,
      filter: 'drop-shadow(0px 0px 6px #f9cd0d)',
    },
    '& > *': {
      marginTop: -6,
    },
  },
  active: {
    top: 58,
    filter: 'drop-shadow(0px 0px 6px #f9cd0d)',
  },
  button: {
    width: 34,
    height: 34,
    background: `url('${
      require('@shared/assets/images/expression.png').default
    }') no-repeat`,
    backgroundSize: 140,
    backgroundPosition: '-103px -40px',
  },
}));
const useStylesTooltip = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
  },
}));

const defaultText = '一键拔线 (快捷键 F1)';
const appDirPath = config.get('heartstoneRootPath') as string;
const appName = is.windows
  ? 'Hearthstone.exe'
  : is.macos
  ? 'Hearthstone.app'
  : '';
// 游戏路径
const appPath = path.join(appDirPath, appName);
// 断线时间
const timeOut = 3;
const ruleName = 'HBT炉石拔线';
const Unplug: React.FC = () => {
  const classes = useStyles();
  const tooltipClasses = useStylesTooltip();
  const [tooltip, setTooltip] = React.useState<string>(defaultText);
  const [loading, { toggle: toggleLoading }] = useBoolean(false);

  const handleUnplug = React.useCallback(async () => {
    if (!loading) {
      toggleLoading(true);
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

      // 等几秒后禁用防火墙规则
      setTimeout(async () => {
        await disableRule(ruleName, appPath, setTooltip);
        setTimeout(() => {
          setTooltip(defaultText);
          toggleLoading(false);
        }, 3000);
      }, timeOut * 1000);
    }
  }, [loading, toggleLoading]);
  useMount(() => {
    remote.globalShortcut.register('F1', handleUnplug);
  });

  return (
    <Tooltip title={tooltip} classes={tooltipClasses} placement="top" arrow>
      <div
        className={clsx(classes.root, {
          [classes.active]: loading,
        })}
        onClick={handleUnplug}
      >
        {loading ? (
          <Loading size="small" />
        ) : (
          <div className={classes.button} />
        )}
      </div>
    </Tooltip>
  );
};

export default Unplug;
