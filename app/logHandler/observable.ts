import fs from 'fs';
import { bindNodeCallback, combineLatest, Observable } from 'rxjs';

import config from './config';

const open = bindNodeCallback(fs.open);

/**
 * 读取 Log 创建 Observable
 */
function createObservable() {
  const fd$ = open(config.heartstoneLogFilePath, 'r');
  const watched$ = new Observable<[fs.Stats, fs.Stats]>((observer) => {
    fs.watchFile(
      config.heartstoneLogFilePath,
      { interval: 1000 },
      (cur, prev) => {
        observer.next([cur, prev]);
      }
    );
  });
  return combineLatest([fd$, watched$]);
}

export default createObservable;
