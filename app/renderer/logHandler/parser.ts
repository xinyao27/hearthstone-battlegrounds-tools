import fs from 'fs';
import { bindNodeCallback, Observable, of } from 'rxjs';
import {
  catchError,
  filter as filterOperator,
  map,
  mergeMap,
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
    map((buffer) => {
      const string = buffer.toString();
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
