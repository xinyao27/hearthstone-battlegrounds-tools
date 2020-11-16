import { Subscription } from 'rxjs';

import { Topic } from '@shared/constants/topic';
import { getStore } from '@shared/store';

import type { Filtered } from './parser';

const store = getStore();

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
      if (source.state === 'BOX_GAME_START') {
        observable = cb?.();
      }
      // 对局结束 结束监控 Power.log 以及关闭悬浮框
      if (source.state === 'BOX_GAME_OVER') {
        observable?.unsubscribe();
      }
    }

    store.dispatch<Topic.FLOW>({
      type: Topic.FLOW,
      payload: {
        type,
        source,
      },
    });
  }
}
