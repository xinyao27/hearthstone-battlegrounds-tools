import { Observable } from 'rxjs';
import type { StateRegex } from './regex';

export type Line = {
  date: string;
  fn: string;
  params: string;
};
export interface ParsedLine {
  date: string;
  state: string;
  result: any;
  line: Line;
}

export const readline = () => (source: Observable<Buffer>) =>
  new Observable<Line>((observer) =>
    source.subscribe({
      next: (buffer) => {
        buffer
          .toString()
          .split('\n')
          .map((v) =>
            v.split(' ').filter((v2) => v2 !== '' && v2 !== 'D' && v2 !== '-')
          )
          .forEach((item) => {
            const [date, fn, ...params] = item;
            observer.next({ date, fn, params: params.join(' ') });
          });
      },
      error: (err) => {
        observer.error(err);
      },
      complete: () => {
        observer.complete();
      },
    })
  );

export const parseLine = (stateRegexes: StateRegex[]) => (
  source: Observable<Line>
) =>
  new Observable<ParsedLine>((observer) =>
    source.subscribe({
      next: (line: Line) => {
        stateRegexes.forEach(({ state, fn, regex, index = 0 }) => {
          const matched = line.params.match(regex);
          if (line.fn === fn && matched) {
            const result = Array.isArray(index)
              ? index.map((i) => matched[i])
              : matched[index];
            observer.next({
              date: line.date,
              state,
              result,
              line,
            });
          }
        });
      },
      error: (err) => {
        observer.error(err);
      },
      complete: () => {
        observer.complete();
      },
    })
  );
