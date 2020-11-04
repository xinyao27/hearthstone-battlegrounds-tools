import { Subscription } from 'rxjs';

import type { Sorted } from './parser';
import manager from './manager';

function createObserver(type: 'box' | 'state', cb?: () => Subscription) {
  return {
    next: (value: Sorted) => {
      manager(type, value, cb);
    },
    complete: () => console.log(`${type} observer complete`),
    error: (err: Error) => console.log(`${type} observer error: `, err),
  };
}

export default createObserver;
