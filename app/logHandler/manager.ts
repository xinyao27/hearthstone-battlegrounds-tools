import { remote, ipcRenderer } from 'electron';
import { Subscription } from 'rxjs';

import type { WatchState } from '@app/types';
import {
  LOGHANDLER_SUSPENSION_MESSAGE,
  LOGHANDLER_MAIN_MESSAGE,
} from '@app/constants/topic';

import type { Filtered } from './parser';

/**
 * 负责将整理过的日志信息向外广播
 * @param type
 * @param source
 * @param cb
 */
export function logManager(
  type: 'box' | 'state',
  source: Filtered,
  cb?: () => Subscription
) {
  if (type === 'box') {
    let observable = null;
    // 对局开始 开始监控 Power.log 以及加载悬浮框
    if (source.state === 'GAME_START') {
      observable = cb?.();

      // 这里可能会提前显示悬浮框，导致悬浮框的内容还在上一局结束的状态
      // ipcRenderer.send('showSuspension');
    }
    // 对局结束 结束监控 Power.log 以及关闭悬浮框
    if (source.state === 'GAME_OVER') {
      observable?.unsubscribe();

      ipcRenderer.send('hideSuspension');
    }
  }

  const { suspensionWindow } = remote.getGlobal('windows');
  if (suspensionWindow !== undefined) {
    ipcRenderer.sendTo(
      suspensionWindow.webContents?.id,
      LOGHANDLER_SUSPENSION_MESSAGE,
      {
        type,
        source,
      }
    );
  }
}

/**
 * 负责将监控的状态传递到 main 窗口
 * @param state
 * @param message
 */
export function watchStateManager(
  state: WatchState['state'],
  message: WatchState['message']
) {
  const { mainWindow } = remote.getGlobal('windows');
  if (mainWindow !== undefined) {
    ipcRenderer.sendTo(mainWindow.webContents?.id, LOGHANDLER_MAIN_MESSAGE, {
      type: 'watchState',
      state,
      message,
    });
  }
}
