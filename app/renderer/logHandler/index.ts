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
  let subscription: Subscription | null | undefined = null;
  store.subscribe<Topic.START_WATCH>((action) => {
    if (action.type === Topic.START_WATCH) {
      if (subscription) {
        subscription.unsubscribe();
        subscription = null;
      }
      subscription = startWatch();
      log.info(`${Topic.START_WATCH} - started`);
    }
  });
}

export default run;
