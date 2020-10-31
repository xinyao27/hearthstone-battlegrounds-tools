import type { Sorted } from './parser';
import manager from './manager';

function createObserver() {
  return {
    next: (value: Sorted) => {
      manager(value);
    },
    complete: () => console.log('observer complete'),
    error: (err: Error) => console.log('observer error: ', err),
  };
}

export default createObserver;
