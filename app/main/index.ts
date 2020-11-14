/* eslint no-console: off */

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { is } from 'electron-util';

import Launcher from './Launcher';

if (is.development) {
  require('./index.dev');
} else {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

new Launcher();
