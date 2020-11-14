import { app } from 'electron';
import { is } from 'electron-util';
import { EventEmitter } from 'events';
import log from 'electron-log';

import CoreManager from './windows/CoreManager';
import LogHandlerManager from './windows/LogHandlerManager';
import SuspensionManager from './windows/SuspensionManager';

class Launcher extends EventEmitter {
  coreManager?: CoreManager;

  logHandlerManager?: LogHandlerManager;

  suspensionManager?: SuspensionManager;

  constructor() {
    super();

    this.makeSingleInstance(this.init);
  }

  init() {
    global.windows = {
      coreWindow: null,
      logHandlerWindow: null,
      suspensionWindow: null,
    };
    global.managers = {
      coreManager: null,
      logHandlerManager: null,
      suspensionManager: null,
    };

    this.coreManager = new CoreManager({
      onInit: (window) => {
        global.windows.coreWindow = window;
        if (is.development) {
          window.webContents.on('did-frame-finish-load', () => {
            window.webContents.once('devtools-opened', () => {
              window.focus();
            });
            window.webContents.openDevTools();
          });
          window.webContents.openDevTools();
        }
      },
      onDestroy: () => {
        this.logHandlerManager?.destroy();
        this.suspensionManager?.destroy();
      },
    });
    this.logHandlerManager = new LogHandlerManager({
      onInit: (window) => {
        global.windows.logHandlerWindow = window;
        if (is.development) {
          window.webContents.on('did-frame-finish-load', () => {
            window.webContents.openDevTools();
          });
          window.webContents.openDevTools();
        }
      },
    });
    this.suspensionManager = new SuspensionManager({
      onInit: (window) => {
        global.windows.suspensionWindow = window;
        if (is.development) {
          window.webContents.on('did-frame-finish-load', () => {
            window.webContents.openDevTools();
          });
          window.webContents.openDevTools();
        }
      },
    });

    global.managers.coreManager = this.coreManager;
    global.managers.logHandlerManager = this.logHandlerManager;
    global.managers.suspensionManager = this.suspensionManager;
  }

  makeSingleInstance(callback: () => void) {
    const gotSingleLock = app.requestSingleInstanceLock();

    if (!gotSingleLock) {
      app.quit();
    } else {
      app.on('second-instance', () => {
        this.coreManager?.show();
      });
    }

    app.on('window-all-closed', async () => {
      // Respect the OSX convention of having the application in memory even
      // after all windows have been closed
      if (!is.macos) {
        app.quit();
      }
    });

    if (process.env.E2E_BUILD === 'true') {
      app
        .whenReady()
        // eslint-disable-next-line promise/no-callback-in-promise
        .then(callback)
        .catch((err) =>
          log.error(`E2E_BUILD - An error occurred during startup: `, err)
        );
    } else {
      app.on('ready', callback);
    }

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (!this.coreManager) callback();
    });
  }
}

export default Launcher;
