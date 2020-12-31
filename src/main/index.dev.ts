/* eslint no-console: off */

// import { app } from 'electron';

require('electron-debug')();

// app
//   .whenReady()
//   .then(() => {
//     const installer = require('electron-devtools-installer');
//     const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
//     const extensions = ['REACT_DEVELOPER_TOOLS'];
//
//     return installer.default(
//       extensions.map((name) => installer[name]),
//       forceDownload
//     );
//   })
//   .then((name) => console.log(`Added Extension: ${name}`))
//   .catch((err) => console.log('Added Extension Error: ', err));
