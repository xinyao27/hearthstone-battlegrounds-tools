import { Subscription } from 'rxjs';
import log from 'electron-log';

import type { Filtered } from './parser';
import { logManager } from './manager';

function createObserver(type: 'box' | 'state', cb?: () => Subscription) {
  return {
    next: (value: Filtered | null) => {
      log.info(type, value);
      logManager(type, value, cb);
    },
    complete: () => {
      const message = `${type} 🔚 工作结束`;
      log.warn(message);
    },
    error: (err: Error) => {
      const message = `${type} ❌ 工作出现了问题: ${err}`;
      log.error(message);
    },
  };
}

export default createObserver;
