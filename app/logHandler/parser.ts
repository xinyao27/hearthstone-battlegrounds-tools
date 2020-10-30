import { Observable } from 'rxjs';

export const readline = () => (source: Observable<Buffer>) =>
  new Observable((observer) => {
    return source.subscribe({
      next: (buffer) => {
        buffer
          .toString()
          .split('\n')
          .map((v) =>
            v.split(' ').filter((v2) => v2 !== '' && v2 !== 'D' && v2 !== '-')
          )
          .forEach((item) => {
            const [time, fn, action, ...params] = item;
            if (fn === 'GameState.DebugPrintEntityChoices()') {
              observer.next({ time, fn, action, params });
            }
          });
      },
      error: (err) => {
        observer.error(err);
      },
      complete: () => {
        observer.complete();
      },
    });
  });
