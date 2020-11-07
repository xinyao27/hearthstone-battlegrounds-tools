/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  BrowserWindowConstructorOptions,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

import { getPlatform, isDevelopment, Platform } from './utils';

const isDevelop = isDevelopment();

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDevelop || process.env.DEBUG_PROD === 'true') {
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

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      windows: {
        mainWindow?: BrowserWindow;
        logHandlerWindow?: BrowserWindow;
        suspensionWindow?: BrowserWindow;
      };
    }
  }
}
global.windows = {};

let suspensionWindow: BrowserWindow | null = null;
function createSuspensionWindow() {
  const size = screen.getPrimaryDisplay().workAreaSize; // 获取显示器的宽高
  suspensionWindow = new BrowserWindow({
    width: 260,
    height: size.height > 1200 ? 1200 : size.height,
    type: 'toolbar',
    transparent: true,
    frame: false,
    resizable: true,
    show: false,
    webPreferences:
      (isDevelop || process.env.E2E_BUILD === 'true') &&
      process.env.ERB_SECURE !== 'true'
        ? {
            nodeIntegration: true,
            enableRemoteModule: true,
          }
        : {
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'dist/renderer.prod.js'),
          },
    alwaysOnTop: true,
  });
  global.windows.suspensionWindow = suspensionWindow;
  const winSize = suspensionWindow.getSize(); // 获取窗口宽高

  const x = size.width - winSize[0];
  const y = 100;
  suspensionWindow.setPosition(x, y);
  suspensionWindow.setAlwaysOnTop(true, 'screen-saver', 1000);
  suspensionWindow.loadURL(
    `file://${__dirname}/app.html?name=renderer&type=suspension`
  );

  suspensionWindow.once('ready-to-show', () => {
    // suspensionWindow?.show();
  });

  suspensionWindow.on('resize', () => {
    // 禁止横向拖动改变大小
    // TODO 这里会造成抖动，但是 will-resize 不知怎么返回的 newBounds 不对，待解决
    if (suspensionWindow?.getSize()[0] !== winSize[0]) {
      suspensionWindow?.setBounds({
        width: winSize[0],
        height: winSize[1],
        x,
        y,
      });
    }
  });
  suspensionWindow.on('close', () => {
    suspensionWindow = null;
  });
}

ipcMain.on('showSuspension', () => {
  if (suspensionWindow) {
    if (!suspensionWindow.isVisible()) {
      suspensionWindow.show();
      suspensionWindow.showInactive();
    }
  } else {
    createSuspensionWindow();
  }
});
ipcMain.on('hideSuspension', () => {
  if (suspensionWindow) {
    suspensionWindow.hide();
  }
});

let logHandlerWindow: BrowserWindow | null = null;
function createLogHandlerWindow() {
  logHandlerWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: isDevelop,
    webPreferences: { nodeIntegration: true, enableRemoteModule: true },
  });
  global.windows.logHandlerWindow = logHandlerWindow;
  logHandlerWindow.loadURL(`file://${__dirname}/app.html?name=logHandler`);
}

const createWindow = async () => {
  if (isDevelop || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const options: BrowserWindowConstructorOptions = {
    show: false,
    width: 1024,
    height: 768,
    titleBarStyle: 'hidden',
    maximizable: false,
    icon: getAssetPath('icon.png'),
    webPreferences:
      (isDevelop || process.env.E2E_BUILD === 'true') &&
      process.env.ERB_SECURE !== 'true'
        ? {
            nodeIntegration: true,
            enableRemoteModule: true,
          }
        : {
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'dist/renderer.prod.js'),
          },
  };
  if (getPlatform() === Platform.WINDOWS) {
    options.frame = false;
  }
  mainWindow = new BrowserWindow(options);
  global.windows.mainWindow = mainWindow;

  mainWindow.loadURL(`file://${__dirname}/app.html?name=renderer`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;

    logHandlerWindow?.destroy();
    suspensionWindow?.destroy();
    logHandlerWindow = null;
    suspensionWindow = null;
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();

  // logHandler
  createLogHandlerWindow();
  // SuspensionWindow
  createSuspensionWindow();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', async () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

if (process.env.E2E_BUILD === 'true') {
  // eslint-disable-next-line promise/catch-or-return
  app.whenReady().then(createWindow);
} else {
  app.on('ready', createWindow);
}

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
