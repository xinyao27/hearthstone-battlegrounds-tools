import createObservable from './observable';
import createObserver from './observer';
import { readFile, readline, filter, sort } from './parser';
import { stateRegexes } from './regex';

function run() {
  const source$ = createObservable();
  const observer = createObserver();

  source$
    .pipe(readFile(), readline(), filter(stateRegexes), sort())
    .subscribe(observer);
}
run();
