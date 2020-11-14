/* eslint no-console: off */

import { app } from 'electron';

require('electron-debug')();

app
  .whenReady()
  .then(() => {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
    } = require('electron-devtools-installer');

    return installExtension(REACT_DEVELOPER_TOOLS);
  })
  .then((name) => console.log(`Added Extension: ${name}`))
  .catch((err) => console.log('Added Extension Error: ', err));
