import fs from 'fs';
import { bindNodeCallback, Observable, of } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  buffer as bufferOperator,
  scan,
  filter as filterOperator,
} from 'rxjs/operators';

import type { BoxState, Feature, State } from './features';
import LogBlock from './LogBlock';
import { match } from './utils';

const read = bindNodeCallback(fs.read);
export const readFile = () => (
  source: Observable<{ fd: number; cur: fs.Stats; prev: fs.Stats }>
) =>
  source.pipe(
    mergeMap(({ fd, cur, prev }) => {
      const length = cur.size - prev.size;
      if (length > 0) {
        const buffer = Buffer.alloc(length);
        const position = prev.size;

        return read(fd, buffer, 0, length, position).pipe(map((v) => v[1]));
      }
      return of(Buffer.alloc(0));
    }),
    catchError((err) => {
      throw err;
    })
  );

export const parser = () => (source: Observable<Buffer>) =>
  source.pipe(
    bufferOperator(source),
    scan((acc, cur) => {
      const curString = cur.toString();
      if (curString) {
        const accArray = acc.split('\n').filter((v) => v);
        const curArray = curString.split('\n').filter((v) => v);
        if (curArray.length) {
          const lastOne = accArray[accArray.length - 1];
          if (lastOne) {
            const firstOne = curArray[0];
            const [, lastOneDate] = lastOne.split(' ');
            const [, firstOneDate] = firstOne.split(' ');
            // acc 的最后一项 与 cur 的第一项日期相同 => 合并
            if (lastOneDate === firstOneDate) {
              return `${acc}${curString}`;
            }
            // acc 的最后一项 与 cur 的第一项日期不同 => 直接返回 cur
            return curString;
          }
          // 初始化
          return curString;
        }
        // cur 为 null
        return acc;
      }
      return acc;
    }, ''),
    map((string) => {
      if (string) {
        return new LogBlock(string);
      }
      return null;
    }),
    catchError((err) => {
      throw err;
    })
  );

/**
 * 过滤掉无用日志
 * @param features
 */
export const filter = (features: Feature<State>[] | Feature<BoxState>[]) => (
  source: Observable<LogBlock | null>
) =>
  source.pipe(
    map((block) => {
      if (
        block &&
        block.original &&
        Array.isArray(block.data) &&
        block.data.length
      ) {
        return match(features, block.data);
      }
      return null;
    }),
    filterOperator((v) => !!v && !!v.length),
    catchError((err) => {
      throw err;
    })
  );
