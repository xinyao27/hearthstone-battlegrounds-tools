import { Observable, Subscription } from 'rxjs';
import { ipcRenderer } from 'electron';
import log from 'electron-log';

import { MAIN_LOGHANDLER_MESSAGE } from '@app/constants/topic';

import createObservable from './observable';
import createObserver from './observer';
import { readFile, readline, filter } from './parser';
import { stateRegexes, boxRegexes } from './regex';
import config from './config';

const createPowerLogObservable = (observable: Observable<any>) => () =>
  observable
    .pipe(readFile(), readline(), filter(stateRegexes))
    .subscribe(createObserver('state'));

function run() {
  const BoxSource$ = createObservable(config.heartstoneBoxLogFilePath);
  const PowerLogSource$ = createObservable(config.heartstonePowerLogFilePath);

  return BoxSource$.pipe(readFile(), readline(), filter(boxRegexes)).subscribe(
    createObserver('box', createPowerLogObservable(PowerLogSource$))
  );
}

interface StartWatch {
  type: 'startWatch';
  data: string;
}
let isWatching = false;
let subscription: Subscription;
ipcRenderer.on(MAIN_LOGHANDLER_MESSAGE, (_, args: StartWatch) => {
  if (isWatching) {
    subscription?.unsubscribe();
    isWatching = false;
  }
  if (args.type === 'startWatch') {
    subscription = run();
    isWatching = true;
    log.info('startWatch - started');
  }
});
