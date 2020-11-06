import React from 'react';
import { ipcRenderer, remote } from 'electron';
import { useMount, useBoolean } from 'ahooks';
import { IconButton, Switch } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import SettingsIcon from '@material-ui/icons/Settings';
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

import { config } from '@app/store';

import OBS from './OBS';

interface Item {
  icon: React.ReactElement;
  label: string;
  action: React.ReactNode | React.Component;
}
function getList(): Item[] {
  const { suspensionWindow } = remote.getGlobal('windows');
  const list: Item[] = [
    {
      icon: <FolderIcon />,
      label: '设置《炉石传说》安装路径',
      action: function Action() {
        const handleClick = () => {
          remote.dialog
            .showOpenDialog({ properties: ['openDirectory'] })
            .then((result) => {
              if (!result.canceled && result.filePaths[0]) {
                config.set('heartstoneRootPath', result.filePaths[0]);
              }
              return result;
            })
            .catch(console.log);
        };
        return (
          <IconButton onClick={handleClick}>
            <SettingsIcon />
          </IconButton>
        );
      },
    },
    {
      icon: <AllInboxIcon />,
      label: '打开缓存目录',
      action: function Action() {
        const handleClick = () => {
          // require('child_process').exec(
          //   `start "" "${remote.app.getPath('userData')}"`
          // );
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
      icon: <RadioButtonCheckedIcon />,
      label: 'OBS设置',
      action: function Action() {
        return <OBS />;
      },
    },
  ];

  if (process.env.NODE_ENV === 'development') {
    list.unshift({
      icon: <DeveloperModeIcon />,
      label: '悬浮框展示',
      action: function Action() {
        const [checked, { toggle }] = useBoolean(false);
        useMount(() => {
          toggle(suspensionWindow.isVisible());
        });
        return (
          <Switch
            edge="end"
            checked={checked}
            onChange={(_, value) => {
              toggle(value);
              ipcRenderer.send(value ? 'showSuspension' : 'hideSuspension');
            }}
          />
        );
      },
    });
  }

  return list;
}

export default getList;
