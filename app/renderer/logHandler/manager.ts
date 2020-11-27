import { Subscription } from 'rxjs';
import log from 'electron-log';

import { Topic } from '@shared/constants/topic';
import { getStore } from '@shared/store';
import type { LogData } from '@shared/types';

import type { MatchResult } from './utils';

const store = getStore();
let observable: Subscription | null | undefined = null;

/**
 * 负责将整理过的日志信息向外广播
 * @param type
 * @param source
 * @param cb
 */
export function logManager(
  type: 'box' | 'state',
  source: MatchResult[] | null,
  cb?: () => Subscription
) {
  if (source && source.length) {
    source.forEach((item) => {
      const result = item.feature?.getResult?.(item.line);
      const data: LogData = {
        type,
        date: item.date,
        state: item.state,
        original: item.line?.original,
        result,
      };
      log.info(data);
      if (type === 'box') {
        // 对局开始 开始监控 Power.log 以及加载悬浮框
        if (item.state === 'BOX_GAME_START') {
          observable = cb?.();
        }
        // 对局结束 结束监控 Power.log 以及关闭悬浮框
        if (item.state === 'BOX_GAME_OVER') {
          observable?.unsubscribe();
          observable = null;
        }
      }
      store.dispatch<Topic.FLOW>({
        type: Topic.FLOW,
        payload: data,
      });
    });
  }
}
