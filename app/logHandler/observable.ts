import fs from 'fs';
import { Observable } from 'rxjs';
import chokidar from 'chokidar';

/**
 * 读取 Log 创建 Observable
 */
function createObservable(filePath: string) {
  return new Observable<{ filePath: string; cur: fs.Stats; prev: fs.Stats }>(
    (observer) => {
      const watcher = chokidar.watch(filePath, {
        persistent: true,
        usePolling: true,
        alwaysStat: true,
        interval: 100,
      });
      let prev: fs.Stats | undefined;
      let cur: fs.Stats | undefined;
      watcher
        .on('add', (_, stats) => {
          prev = stats;
          cur = stats;
          if (prev && cur) {
            observer.next({ filePath, cur, prev });
          }
        })
        .on('change', (_, stats) => {
          prev = cur;
          cur = stats;
          if (prev && cur) {
            observer.next({ filePath, cur, prev });
          }
        });
      return {
        unsubscribe() {
          console.log('unsubscribe', filePath);
          watcher.close();
        },
      };
    }
  );
}

export default createObservable;
