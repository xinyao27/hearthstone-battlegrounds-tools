import React from 'react';
import { remote } from 'electron';
import { useMount, useBoolean } from 'ahooks';
import {
  IconButton,
  Switch,
  Tooltip,
  Select,
  MenuItem,
} from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import SettingsIcon from '@material-ui/icons/Settings';
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import BuildIcon from '@material-ui/icons/Build';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import { useSnackbar } from 'notistack';

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
  const list: Item[] = [
    {
      icon: <DeveloperModeIcon />,
      label: '悬浮框展示',
      action: function Action() {
        const [checked, { toggle }] = useBoolean(
          suspensionManager?.window.isVisible()
        );
        useMount(() => {
          toggle(suspensionManager?.window.isVisible());
        });
        return (
          <Switch
            edge="end"
            checked={checked}
            onChange={(_, value) => {
              toggle(value);
              if (value) {
                suspensionManager?.show();
              } else {
                suspensionManager?.hide();
              }
            }}
          />
        );
      },
    },
    {
      id: 'heartstoneRootPathSetting',
      icon: <FolderIcon />,
      label: '设置《炉石传说》安装路径',
      action: function Action() {
        const [, { check }] = useInit();
        const handleClick = () => {
          remote.dialog
            .showOpenDialog({ properties: ['openDirectory'] })
            .then((result) => {
              if (!result.canceled && result.filePaths[0]) {
                config.set('heartstoneRootPath', result.filePaths[0]);
                check();
              }
              return result;
            })
            // eslint-disable-next-line no-console
            .catch(console.log);
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
      icon: <AllInboxIcon />,
      label: '打开缓存目录',
      action: function Action() {
        const handleClick = () => {
          remote.shell.showItemInFolder(remote.app.getPath('userData'));
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
          <Tooltip title="若插件不展示信息可尝试（请在炉石关闭状态下使用）">
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
        const [framerate, { toggle }] = useFramerate();

        return (
          <Tooltip
            title="帧数设置过高可能导致画面闪烁，请依据电脑配置合理选择。重启炉石后生效！"
            arrow
          >
            <Select
              value={framerate}
              onChange={(e) => toggle(e.target.value as Framerate)}
            >
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

  return list;
}

export default getList;
