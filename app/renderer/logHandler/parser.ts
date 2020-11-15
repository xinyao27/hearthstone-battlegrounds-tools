import fs from 'fs';
import { Observable, bindNodeCallback, of } from 'rxjs';
import {
  catchError,
  mergeMap,
  map,
  filter as filterOperator,
} from 'rxjs/operators';

import type { Regex, BoxState, State } from './regex';

const read = bindNodeCallback(fs.read);
const open = bindNodeCallback(fs.open);
export const readFile = () => (
  source: Observable<{ filePath: string; cur: fs.Stats; prev: fs.Stats }>
) =>
  source.pipe(
    mergeMap(({ filePath, cur, prev }) => {
      return open(filePath, 'r').pipe(map((fd) => ({ fd, cur, prev })));
    }),
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
      throw `readFile: ${err}`;
    })
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
        .reduce<Line[]>((acc, cur) => {
          const has = acc.find((v) => v.date === cur.date);
          if (has) {
            const item: Line = {
              ...has,
              params: `${has.params} ${cur.params}`,
            };
            return [...acc, item];
          }
          return [...acc, cur];
        }, [])
    ),
    mergeMap((v) => v),
    catchError((err) => {
      throw `readline: ${err}`;
    })
  );

export interface Filtered {
  date: string;
  state: State | BoxState;
  result?: any;
  line: Line;
}
/**
 * 过滤掉无用日志
 * @param regexes
 */
export const filter = (regexes: Regex<State>[] | Regex<BoxState>[]) => (
  source: Observable<Line>
) =>
  source.pipe(
    map((line) => {
      if (line.date && line.fn) {
        // eslint-disable-next-line no-restricted-syntax
        for (const { state, fn, regex, index = 0 } of regexes) {
          const fnMatched = line.fn.match(fn);
          if (fnMatched) {
            if (line.params.length) {
              if (regex) {
                const paramsMatched = line.params.match(regex);
                // eslint-disable-next-line no-nested-ternary
                if (paramsMatched) {
                  const result = Array.isArray(index)
                    ? index.map((i) => paramsMatched[i])
                    : paramsMatched[index];
                  return {
                    date: line.date,
                    state,
                    result,
                    line,
                  };
                }
              }
            } else {
              return {
                date: line.date,
                state,
                line,
              };
            }
          }
        }
      }
      return null;
    }),
    filterOperator((v) => !!v),
    catchError((err) => {
      throw `filter: ${err}`;
    })
  );
