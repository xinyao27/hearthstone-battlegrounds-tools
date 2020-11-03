import fs from 'fs';
import { bindNodeCallback, combineLatest, Observable } from 'rxjs';

const open = bindNodeCallback(fs.open);

/**
 * 读取 Log 创建 Observable
 */
function createObservable(filePath: fs.PathLike) {
  const fd$ = open(filePath, 'r');
  const watched$ = new Observable<[fs.Stats, fs.Stats]>((observer) => {
    fs.watchFile(filePath, { interval: 1000 }, (cur, prev) => {
      observer.next([cur, prev]);
    });
    return {
      unsubscribe() {
        fs.unwatchFile(filePath);
      },
    };
  });
  return combineLatest([fd$, watched$]);
}

export default createObservable;
