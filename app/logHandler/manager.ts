import { remote, ipcRenderer } from 'electron';
import { Subscription } from 'rxjs';

import { LOGHANDLER_SUSPENSION_MESSAGE } from '@app/constants/topic';

import type { Filtered } from './parser';

/**
 * 负责将整理过的日志信息向外广播
 * @param type
 * @param source
 * @param cb
 */
export function logManager(
  type: 'box' | 'state',
  source: Filtered | null,
  cb?: () => Subscription
) {
  if (source) {
    if (type === 'box') {
      let observable = null;
      // 对局开始 开始监控 Power.log 以及加载悬浮框
      if (source.state === 'GAME_START') {
        observable = cb?.();
      }
      // 对局结束 结束监控 Power.log 以及关闭悬浮框
      if (source.state === 'GAME_OVER') {
        observable?.unsubscribe();
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
}
