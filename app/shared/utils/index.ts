import * as Sentry from '@sentry/electron';
import { is } from 'electron-util';

const { version } = require('../../package.json');

export function monitor(
  process: 'main' | 'renderer',
  type?: 'core' | 'logHandler' | 'suspension'
) {
  if (!is.development) {
    Sentry.init({
      dsn:
        'https://74336b02fd094a6bae10eda746feacbb@o494073.ingest.sentry.io/5564352',
      release: `hearthstone-battlegrounds-tools@${version}`,
    });
    Sentry.setTag('process', process);
    if (type) Sentry.setTag('type', type);
  }
}
