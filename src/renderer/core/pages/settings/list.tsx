import React from 'react';
import { remote } from 'electron';
import path from 'path';
import { useBoolean } from 'ahooks';
import {
  IconButton,
  Button,
  Switch,
  Tooltip,
  Select,
  MenuItem,
} from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import SettingsIcon from '@material-ui/icons/Settings';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import SportsMmaIcon from '@material-ui/icons/SportsMma';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import BuildIcon from '@material-ui/icons/Build';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import { useSnackbar } from 'notistack';
import { is } from 'electron-util';

import { config } from '@shared/store';
import useInit from '@core/hooks/useInit';
import useFramerate, { Framerate } from '@core/hooks/useFramerate';

import OBS from './OBS';
import resetGame from './resetGame';

interface Item {
  id?: string;
  icon: React.ReactElement;
  label: string;
  action: React.ReactNode | React.Component;
}
function getList(): Item[] {
  const { suspensionManager } = remote.getGlobal('managers');
  return [
    {
      icon: <DeveloperModeIcon />,
      label: '当前悬浮框展示状态',
      action: function Action() {
        const handleToggle = () => {
          const visible = suspensionManager?.window.isVisible();
          if (visible) {
            suspensionManager?.hide();
          } else {
            suspensionManager?.show();
          }
        };
        return <Button onClick={handleToggle}>切换</Button>;
      },
    },
    {
      id: 'heartstoneRootPathSetting',
      icon: <FolderIcon />,
      label: '设置《炉石传说》安装路径',
      action: function Action() {
        const { enqueueSnackbar } = useSnackbar();
        const [, { check }] = useInit();
        const handleClick = () => {
          remote.dialog
            .showOpenDialog({ properties: ['openDirectory'] })
            .then((result) => {
              if (!result.canceled && result.filePaths[0]) {
                config.set('heartstoneRootPath', result.filePaths[0]);
                return check();
              }
              throw result;
            })
            .then((success) => {
              if (success) {
                enqueueSnackbar('设置《炉石传说》安装路径成功', {
                  variant: 'success',
                });
              }
              return success;
            })
            .catch(() => {
              enqueueSnackbar('设置《炉石传说》安装路径失败，请重试', {
                variant: 'error',
              });
            });
        };
        return (
          <Tooltip title={config.get('heartstoneRootPath') as string} arrow>
            <IconButton
              id="heartstoneRootPathSettingButton"
              onClick={handleClick}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      icon: <SportsMmaIcon />,
      label: '玩家分段设置',
      action: function Action() {
        const ranks = [
          {
            label: '所有玩家',
            key: 'all',
          },
          {
            label: '前50% (4200+)',
            key: '50',
          },
          {
            label: '前20% (5900+)',
            key: '20',
          },
          {
            label: '前5% (8100+)',
            key: '5',
          },
          {
            label: '前1% (11000+)',
            key: '1',
          },
        ];
        const [rank, setRank] = React.useState<string>(
          () => (config.get('rank') as string) ?? ranks[0].key
        );
        const { enqueueSnackbar } = useSnackbar();
        const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
          const value = e?.target?.value as string;
          if (value) {
            config.set('rank', value);
            setRank(value);
            const label = ranks.find((v) => v.key === value)?.label;
            enqueueSnackbar(`修改玩家分段 ${label} 成功，重启插件后生效`, {
              variant: 'success',
            });
          } else {
            enqueueSnackbar(`修改玩家分段失败，请重试`, {
              variant: 'error',
            });
          }
        };
        return (
          <Tooltip
            title="这个选项将影响选择英雄时的英雄数据"
            arrow
            placement="left"
          >
            <Select value={rank} onChange={handleChange}>
              {ranks.map((item) => (
                <MenuItem value={item.key} key={item.key}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </Tooltip>
        );
      },
    },
    {
      icon: <VideogameAssetIcon />,
      label: '提前展示游戏排名结果',
      action: function Action() {
        const [checked, { toggle }] = useBoolean(
          config.get('enableGameResult') as boolean
        );
        return (
          <Tooltip title="提前看到排名可能会影响游戏体验，请谨慎开启" arrow>
            <Switch
              edge="end"
              checked={checked}
              onChange={(_, value) => {
                toggle(value);
                config.set('enableGameResult', value);
              }}
            />
          </Tooltip>
        );
      },
    },
    {
      icon: <KeyboardIcon />,
      label: '修改拔线快捷键',
      action: function Action() {
        const shortcuts = [
          'F1',
          'F2',
          'F3',
          'F4',
          'F5',
          'F6',
          'F7',
          'F8',
          'F9',
          'F10',
          'F11',
        ];
        const [shortcut, setShortcut] = React.useState<typeof shortcuts[0]>(
          // @ts-ignore
          () => config.get('shortcuts.unplug')
        );
        const { enqueueSnackbar } = useSnackbar();
        const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
          const value = e?.target?.value as string;
          if (value) {
            config.set('shortcuts.unplug', value);
            setShortcut(value);
            enqueueSnackbar(`修改拔线快捷键 ${value} 成功，重启插件后生效`, {
              variant: 'success',
            });
          } else {
            enqueueSnackbar(`修改拔线快捷键失败，请重试`, {
              variant: 'error',
            });
          }
        };
        return (
          <Select value={shortcut} onChange={handleChange}>
            {shortcuts.map((item) => (
              <MenuItem value={item} key={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      icon: <AllInboxIcon />,
      label: '打开缓存目录',
      action: function Action() {
        const handleClick = () => {
          const targetPath = is.windows
            ? path.join(remote.app.getPath('userData'), remote.app.getName())
            : remote.app.getPath('userData');
          remote.shell.showItemInFolder(targetPath);
        };
        return (
          <IconButton onClick={handleClick}>
            <OpenInNewIcon />
          </IconButton>
        );
      },
    },
    {
      icon: <SettingsBackupRestoreIcon />,
      label: '修复炉石',
      action: function Action() {
        const { enqueueSnackbar } = useSnackbar();
        const handleClick = async () => {
          await resetGame();
          enqueueSnackbar('修复成功，请重启炉石传说', { variant: 'success' });
        };
        return (
          <Tooltip
            title="若插件不展示信息可尝试（请在炉石关闭状态下使用）"
            arrow
          >
            <IconButton onClick={handleClick}>
              <SettingsBackupRestoreIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      icon: <BuildIcon />,
      label: '修改炉石帧数',
      action: function Action() {
        const { enqueueSnackbar } = useSnackbar();
        const [framerate, { toggle }] = useFramerate();
        const handleChange = (
          e: React.ChangeEvent<{ name?: string; value: unknown }>
        ) => {
          const value = e?.target?.value as Framerate;
          if (value) {
            toggle(value);
            enqueueSnackbar(`修改炉石帧数 ${value}Hz 成功，请重启炉石传说`, {
              variant: 'success',
            });
          } else {
            enqueueSnackbar(`修改炉石帧数失败，请重试`, {
              variant: 'error',
            });
          }
        };

        return (
          <Tooltip
            title="帧数设置过高可能导致画面闪烁或游戏卡顿，请依据电脑配置慎重选择！重启炉石后生效！"
            arrow
            placement="left-start"
          >
            <Select value={framerate} onChange={handleChange}>
              <MenuItem value={60}>60Hz</MenuItem>
              <MenuItem value={144}>144Hz</MenuItem>
              <MenuItem value={240}>240Hz</MenuItem>
            </Select>
          </Tooltip>
        );
      },
    },
    {
      icon: <RadioButtonCheckedIcon />,
      label: 'OBS设置',
      action: function Action() {
        return <OBS />;
      },
    },
  ];
}

export default getList;
