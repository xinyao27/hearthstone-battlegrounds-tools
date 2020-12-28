import { EventEmitter } from 'events';
import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { is } from 'electron-util';

import { getAppHTML, getAssetPath } from '../utils';

interface Params {
  onInit: (window: BrowserWindow) => void;
  onDestroy?: () => void;
}

class CoreManager extends EventEmitter {
  option: BrowserWindowConstructorOptions;

  window: BrowserWindow | null;

  constructor({ onInit, onDestroy }: Params) {
    super();

    const defaultOptions: BrowserWindowConstructorOptions = {
      show: false,
      width: 1024,
      height: 768,
      titleBarStyle: 'hidden',
      maximizable: false,
      icon: getAssetPath('icon.png'),
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    };
    if (is.windows) {
      defaultOptions.frame = false;
    }
    this.option = defaultOptions;
    this.window = null;
    this.init(this.option, onInit, onDestroy);
  }

  init(
    options: BrowserWindowConstructorOptions,
    onInit: Params['onInit'] = () => {},
    onDestroy?: Params['onDestroy']
  ) {
    this.window = new BrowserWindow(options);
    if (is.macos) {
      app.dock.setIcon(getAssetPath('icon.png'));
    }
    this.window.loadURL(getAppHTML());
    onInit(this.window);

    this.window.webContents.on('did-finish-load', () => {
      if (!this.window) {
        throw new Error('`coreWindow` is not defined');
      }
      if (process.env.START_MINIMIZED) {
        this.window.minimize();
      } else {
        this.window.show();
      }
    });

    this.window.on('closed', () => {
      this.window = null;
      onDestroy?.();
    });
  }

  destroy() {
    this.window?.destroy();
  }

  show() {
    if (this.window) {
      if (this.window.isMinimized()) this.window.restore();
      this.window.show();
    }
  }

  hide() {
    if (this.window) {
      this.window.hide();
    }
  }
}

export default CoreManager;
