import { Observable } from 'rxjs';
import createObservable from './observable';
import createObserver from './observer';
import { readFile, readline, filter } from './parser';
import { stateRegexes, boxRegexes } from './regex';
import config from './config';
import { watchStateManager } from './manager';

const createPowerLogObservable = (observable: Observable<any>) => () =>
  observable
    .pipe(readFile(), readline(), filter(stateRegexes))
    .subscribe(createObserver('state'));

function run() {
  const BoxSource$ = createObservable(config.heartstoneBoxLogFilePath);
  const PowerLogSource$ = createObservable(config.heartstonePowerLogFilePath);

  BoxSource$.pipe(readFile(), readline(), filter(boxRegexes)).subscribe(
    createObserver('box', createPowerLogObservable(PowerLogSource$))
  );
  watchStateManager('next', '🚀 正在酒馆中工作');
}
run();
