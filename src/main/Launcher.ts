import { app, globalShortcut } from 'electron';
import { is } from 'electron-util';
import { EventEmitter } from 'events';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

import CoreManager from './windows/CoreManager';
import LogHandlerManager from './windows/LogHandlerManager';
import SuspensionManager from './windows/SuspensionManager';

class Launcher extends EventEmitter {
  coreManager?: CoreManager;

  logHandlerManager?: LogHandlerManager;

  suspensionManager?: SuspensionManager;

  constructor() {
    super();

    global.managers = {
      coreManager: null,
      logHandlerManager: null,
      suspensionManager: null,
    };

    this.makeSingleInstance(this.init.bind(this));
  }

  init() {
    this.appUpdater();

    this.coreManager = new CoreManager({
      onInit: (window) => {
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
        global.managers.coreManager = null;
      },
    });
    this.logHandlerManager = new LogHandlerManager({
      onInit: (window) => {
        if (is.development) {
          window.webContents.on('did-frame-finish-load', () => {
            window.webContents.openDevTools();
          });
          window.webContents.openDevTools();
        }
      },
      onDestroy: () => {
        global.managers.logHandlerManager = null;
      },
    });
    this.suspensionManager = new SuspensionManager({
      onInit: (window) => {
        if (is.development) {
          window.webContents.on('did-frame-finish-load', () => {
            window.webContents.openDevTools();
          });
          window.webContents.openDevTools();
        }
      },
      onDestroy: () => {
        global.managers.suspensionManager = null;
      },
    });
    global.managers.coreManager = this.coreManager;
    global.managers.logHandlerManager = this.logHandlerManager;
    global.managers.suspensionManager = this.suspensionManager;

    if (is.macos) {
      app.dock?.show();
    }
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

    app.on('window-all-closed', () => {
      // Respect the OSX convention of having the application in memory even
      // after all windows have been closed
      if (!is.macos) {
        app.quit();
      }
    });

    app
      .whenReady()
      // eslint-disable-next-line promise/no-callback-in-promise
      .then(callback)
      .catch((err) => log.error(err));

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (
        global.managers.coreManager === null &&
        global.managers.logHandlerManager === null &&
        global.managers.suspensionManager === null
      ) {
        this.init();
      }
      this.coreManager?.show();
    });

    app.on('will-quit', () => {
      // 注销所有快捷键
      globalShortcut.unregisterAll();
    });
  }

  appUpdater() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    const url = is.development
      ? 'http://localhost:23333/app'
      : 'https://hs.chenyueban.com/app';
    autoUpdater.setFeedURL(url);
    autoUpdater.checkForUpdatesAndNotify({
      title: 'HBT - 发现新版本',
      body: `{appName} version {version} 已下载将在退出时自动安装`,
    });
  }
}

export default Launcher;
