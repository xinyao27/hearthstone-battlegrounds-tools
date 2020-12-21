import { Integrations } from '@sentry/tracing';
import { is } from 'electron-util';

const { version } = require('../../package.json');

export function monitor(
  process: 'main' | 'renderer',
  renderer?: 'core' | 'logHandler' | 'suspension'
) {
  if (!is.development) {
    const { init, setTag } =
      process === 'main'
        ? require('@sentry/electron/dist/main')
        : require('@sentry/electron/dist/renderer');
    init({
      dsn:
        'https://74336b02fd094a6bae10eda746feacbb@o494073.ingest.sentry.io/5564352',
      release: version,
      integrations: [new Integrations.BrowserTracing()],
    });
    setTag('process', process);
    if (renderer) setTag('renderer', renderer);
  }
}
