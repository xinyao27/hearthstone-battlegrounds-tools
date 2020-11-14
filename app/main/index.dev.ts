/* eslint global-require: off, no-console: off */

import { app } from 'electron';

if (process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return Promise.all(
    extensions.map((name) => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};
if (process.env.DEBUG_PROD === 'true') {
  app
    .whenReady()
    .then(() => {
      return installExtensions();
    })
    .catch((err) => {
      console.log('Unable to install `react-devtools`: \n', err);
    });
}
