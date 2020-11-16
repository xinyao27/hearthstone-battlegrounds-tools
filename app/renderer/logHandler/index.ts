import { Observable, Subscription } from 'rxjs';
import log from 'electron-log';

import { getStore } from '@shared/store';
import { Topic } from '@shared/constants/topic';

import createObservable from './observable';
import createObserver from './observer';
import { readFile, parser, filter } from './parser';
import { boxFeatures, stateFeatures } from './features';
import config from './config';

const createPowerLogObservable = (observable: Observable<any>) => () =>
  observable
    .pipe(readFile(), parser(), filter(stateFeatures))
    .subscribe(createObserver('state'));

function startWatch() {
  const BoxSource$ = createObservable(config.heartstoneBoxLogFilePath);
  const PowerLogSource$ = createObservable(config.heartstonePowerLogFilePath);

  return BoxSource$.pipe(readFile(), parser(), filter(boxFeatures)).subscribe(
    createObserver('box', createPowerLogObservable(PowerLogSource$))
  );
}

function run() {
  const store = getStore();
  let isWatching = false;
  let subscription: Subscription;
  store.subscribe<Topic.START_WATCH>((action) => {
    if (action.type === Topic.START_WATCH) {
      if (isWatching) {
        subscription?.unsubscribe();
        isWatching = false;
      }
      subscription = startWatch();
      isWatching = true;
      log.info(`${Topic.START_WATCH} - started`);
    }
  });
}

export default run;
