import fs from 'fs';
import { Observable } from 'rxjs';
import chokidar from 'chokidar';
import log from 'electron-log';

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
        interval: 50,
      });
      let prev: fs.Stats | undefined;
      let cur: fs.Stats | undefined;
      log.info('监控准备开始', filePath);
      watcher
        .on('add', (_, stats) => {
          log.info('add', filePath);
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
          log.info('unsubscribe', filePath);
          watcher.close();
        },
      };
    }
  );
}

export default createObservable;
