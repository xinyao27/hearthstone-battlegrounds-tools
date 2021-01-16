import { app, globalShortcut } from 'electron';
import { is } from 'electron-util';
import { EventEmitter } from 'events';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

import { getStore } from '../shared/store';
import { Topic } from '../shared/constants/topic';
import CoreManager from './windows/CoreManager';
import LogHandlerManager from './windows/LogHandlerManager';
import SuspensionManager from './windows/SuspensionManager';
import LoginManager from './windows/LoginManager';
import Tray from './tray';

class Launcher extends EventEmitter {
  coreManager?: CoreManager;

  logHandlerManager?: LogHandlerManager;

  suspensionManager?: SuspensionManager;

  loginManager?: LoginManager;

  tray?: Tray;

  constructor() {
    super();

    global.managers = {
      coreManager: null,
      logHandlerManager: null,
      suspensionManager: null,
      loginManager: null,
    };

    this.makeSingleInstance(this.init.bind(this));
    this.handleLoginWindow.call(this);
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

    this.tray = Tray.init();
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

    app.on('window-all-closed', () => {
      app.quit();
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
    autoUpdater.on(
      'download-progress',
      ({
        percent,
      }: {
        total: number;
        delta: number;
        transferred: number;
        percent: number;
        bytesPerSecond: number;
      }) => {
        this.tray?.showUpdateDownloadProgress(percent);
        this.coreManager?.window?.setProgressBar(percent / 100);
        if (percent === 100) {
          this.coreManager?.window?.setProgressBar(-1);
        }
      }
    );
    autoUpdater.checkForUpdatesAndNotify({
      title: 'HBT - 发现新版本',
      body: `{appName} version {version} 已下载将在退出时自动安装`,
    });
  }

  handleLoginWindow() {
    const store = getStore();
    store.subscribe<Topic.LOGIN>((action) => {
      if (action.type === Topic.LOGIN && action.payload.url) {
        this.loginManager = new LoginManager({
          url: action.payload.url,
          onInit: () => {},
          onDestroy: () => {
            global.managers.loginManager = null;
          },
        });
      }
    });
  }
}

export default Launcher;
