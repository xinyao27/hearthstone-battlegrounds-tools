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
function manager(
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

  const { suspensionWindow } = remote.getGlobal('winIds');
  if (suspensionWindow !== undefined) {
    ipcRenderer.sendTo(suspensionWindow, LOGHANDLER_SUSPENSION_MESSAGE, {
      type,
      source,
    });
  }
}

export default manager;
