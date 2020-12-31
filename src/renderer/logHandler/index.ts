import { Subscription } from 'rxjs';
import log from 'electron-log';

import { getStore } from '@shared/store';
import { Topic } from '@shared/constants/topic';

import createObservable from './observable';
import createObserver from './observer';
import { readFile, parser, filter } from './parser';
import { boxFeatures, stateFeatures } from './features';
import config from './config';

function startWatch() {
  const BoxSource$ = createObservable(config.heartstoneBoxLogFilePath);
  const StateSource$ = createObservable(config.heartstonePowerLogFilePath);

  return {
    box: BoxSource$.pipe(readFile(), parser(), filter(boxFeatures)).subscribe(
      createObserver('box')
    ),
    state: StateSource$.pipe(
      readFile(),
      parser(),
      filter(stateFeatures)
    ).subscribe(createObserver('state')),
  };
}

function run() {
  const store = getStore();
  let subscription: {
    box: Subscription | null | undefined;
    state: Subscription | null | undefined;
  } = {
    box: null,
    state: null,
  };
  store.subscribe<Topic.START_WATCH>((action) => {
    if (action.type === Topic.START_WATCH) {
      if (subscription.box) {
        subscription.box.unsubscribe();
        subscription.box = null;
      }
      if (subscription.state) {
        subscription.state.unsubscribe();
        subscription.state = null;
      }
      subscription = startWatch();
      log.info(`${Topic.START_WATCH} - started`);
    }
  });
}

export default run;
