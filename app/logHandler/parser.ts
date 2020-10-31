import fs from 'fs';
import { Observable, of, bindNodeCallback } from 'rxjs';
import {
  scan,
  catchError,
  mergeMap,
  map,
  filter as filterOperator,
} from 'rxjs/operators';
import type { StateRegex } from './regex';

const read = bindNodeCallback(fs.read);
export const readFile = () => (
  source: Observable<[number, [fs.Stats, fs.Stats]]>
) =>
  source.pipe(
    mergeMap(([fd, [cur, prev]]) => {
      const buffer = Buffer.alloc(cur.size - prev.size);
      const length = cur.size - prev.size;
      const position = prev.size;

      return read(fd, buffer, 0, length, position).pipe(map((v) => v[1]));
    }),
    catchError((err) => of(err))
  );

export type Line = {
  date: string;
  fn: string;
  params: string;
};
/**
 * 对日志逐行读取
 */
export const readline = () => (source: Observable<Buffer>) =>
  source.pipe(
    map((buffer) =>
      buffer
        .toString()
        .split('\n')
        .map((v) =>
          v.split(' ').filter((v2) => v2 !== '' && v2 !== 'D' && v2 !== '-')
        )
        .map((item) => {
          const [date, fn, ...params] = item;
          return { date, fn, params: params.join(' ') };
        })
    ),
    mergeMap((v) => v),
    catchError((err) => of(err))
  );

export interface Filtered {
  date: string;
  state: string;
  result: any;
  line: Line;
}
/**
 * 过滤掉无用日志
 * @param stateRegexes 过滤用到的正则
 */
export const filter = (stateRegexes: StateRegex[]) => (
  source: Observable<Line>
) =>
  source.pipe(
    map((line) => {
      if (line.date && line.fn && line.params) {
        // eslint-disable-next-line no-restricted-syntax
        for (const { state, fn, regex, index = 0 } of stateRegexes) {
          const matched = line.params.match(regex);
          if (line.fn === fn && matched) {
            const result = Array.isArray(index)
              ? index.map((i) => matched[i])
              : matched[index];
            return {
              date: line.date,
              state,
              result,
              line,
            };
          }
        }
      }
      return null;
    }),
    filterOperator((v) => !!v),
    catchError((err) => of(err))
  );

export interface Sorted extends Filtered {
  result: any | any[];
}
/**
 * 对过滤完的内容进行分类
 */
export const sort = () => (source: Observable<Filtered>) =>
  source.pipe(
    scan((acc, value) => {
      if (acc.state === value.state) {
        const result = Array.isArray(acc.result)
          ? [...acc.result, value.result]
          : [acc.result, value.result];
        return {
          ...acc,
          ...value,
          result,
        };
      }
      return {
        ...acc,
        ...value,
      };
    }),
    catchError((err) => of(err))
  );
