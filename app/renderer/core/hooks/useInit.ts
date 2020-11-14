import React from 'react';
import { createModel } from 'hox';
import { useBoolean, useMount } from 'ahooks';
import { is } from 'electron-util';
import { promises as fsPromises } from 'fs';
import { ipcRenderer, remote } from 'electron';

import { config } from '@shared/store';
import { MAIN_LOGHANDLER_MESSAGE } from '@shared/constants/topic';

function useInit(): [boolean, { check: () => Promise<boolean> }] {
  const [correctDirectory, { toggle: setCorrectDirectory }] = useBoolean(true);

  const check = React.useCallback(async () => {
    try {
      // 检测默认炉石路径是否正确
      const heartstoneRootPath = config.get('heartstoneRootPath') as string;
      const stats = await fsPromises.stat(heartstoneRootPath);
      const items = stats.isDirectory()
        ? (await fsPromises.readdir(heartstoneRootPath)) || []
        : [];
      const result = items.some((item) => {
        if (is.windows) {
          return (
            item === 'Hearthstone.exe' ||
            item === 'Hearthstone Beta Launcher.exe'
          );
        }
        if (is.macos) {
          return (
            item === 'Hearthstone.app' ||
            item === 'Hearthstone Beta Launcher.app'
          );
        }
        return false;
      });
      // 如果是合法目录开始监控 Logs
      const { logHandlerWindow } = remote.getGlobal('windows');
      if (result && logHandlerWindow !== undefined) {
        ipcRenderer.sendTo(
          logHandlerWindow.webContents?.id,
          MAIN_LOGHANDLER_MESSAGE,
          {
            type: 'startWatch',
          }
        );
      }
      setCorrectDirectory(result);
      return result;
    } catch (_) {
      setCorrectDirectory(false);
      return false;
    }
  }, [setCorrectDirectory]);

  useMount(() => {
    check();
  });

  return [correctDirectory, { check }];
}

export default createModel(useInit);
