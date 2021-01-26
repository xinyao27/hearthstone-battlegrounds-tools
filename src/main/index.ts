/* eslint no-console: off */

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { is } from 'electron-util'

import { monitor } from '../shared/utils'
import Store from '../shared/store/store'
import Launcher from './Launcher'

if (is.development) {
  require('./index.dev')
} else {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

monitor('main')

// init store
global.store = new Store<never>()

new Launcher()
