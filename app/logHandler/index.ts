import createObservable from './observable';
import createObserver from './observer';
import { readline } from './parser';

function run() {
  const source$ = createObservable();
  const observer = createObserver();

  source$.pipe(readline()).subscribe(observer);
}
run();
