import { remote } from 'electron';
import { is } from 'electron-util';

import GlobalStore from './store';
import { config } from './config';

export function getStore(): GlobalStore<any> {
  if (is.main) {
    return global.store;
  }
  if (is.renderer) {
    return remote.getGlobal('store');
  }
  return new GlobalStore();
}

export { config };
