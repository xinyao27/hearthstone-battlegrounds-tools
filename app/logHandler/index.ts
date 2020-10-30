import createObservable from './observable';
import createObserver from './observer';
import { readline, parseLine } from './parser';
import { stateRegexes } from './regex';

function run() {
  const source$ = createObservable();
  const observer = createObserver();

  source$.pipe(readline(), parseLine(stateRegexes)).subscribe(observer);
}
run();
