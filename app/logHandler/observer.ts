import { Subscription } from 'rxjs';

import type { Filtered } from './parser';
import { logManager, watchStateManager } from './manager';

function createObserver(type: 'box' | 'state', cb?: () => Subscription) {
  return {
    next: (value: Filtered | null) => {
      logManager(type, value, cb);
    },
    complete: () => {
      const message = `${type} 🔚 工作结束`;
      // eslint-disable-next-line no-console
      console.log(message);
      watchStateManager('complete', message);
    },
    error: (err: Error) => {
      const message = `${type} ❌ 工作出现了问题: ${err}`;
      // eslint-disable-next-line no-console
      console.log(message);
      watchStateManager('error', message);
    },
  };
}

export default createObserver;
