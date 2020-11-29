import { Subscription } from 'rxjs';
import log from 'electron-log';

import type { MatchResult } from './utils';
import { logManager } from './manager';

function createObserver(type: 'box' | 'state', cb?: () => Subscription) {
  return {
    next: (value: MatchResult[] | null) => {
      logManager(type, value, cb);
    },
    complete: () => {
      const message = `${type} 🔚 工作结束`;
      log.warn(message);
    },
    error: (err: Error) => {
      const message = `${type} ❌ 工作出现了问题: `;
      log.error(message, err);
    },
  };
}

export default createObserver;
