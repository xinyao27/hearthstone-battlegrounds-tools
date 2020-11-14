import { EventEmitter } from 'events';
import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  screen,
} from 'electron';
import { is } from 'electron-util';

import { getAppHTML } from '../utils';

interface Params {
  onInit: (window: BrowserWindow) => void;
  onDestroy?: () => void;
}

class SuspensionManager extends EventEmitter {
  option: BrowserWindowConstructorOptions;

  window: BrowserWindow | null;

  screenSize: Electron.Size;

  constructor({ onInit, onDestroy }: Params) {
    super();

    this.screenSize = screen.getPrimaryDisplay().workAreaSize;
    this.option = {
      width: 260,
      height:
        this.screenSize.height > 1200 ? 1200 : this.screenSize.height - 100,
      type: 'toolbar',
      transparent: true,
      frame: false,
      resizable: true,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
      alwaysOnTop: true,
    };
    this.window = null;
    this.init(this.option, onInit, onDestroy);
  }

  init(
    options: BrowserWindowConstructorOptions,
    onInit: Params['onInit'] = () => {},
    onDestroy?: Params['onDestroy']
  ) {
    this.window = new BrowserWindow(options);

    // 获取显示器的宽高
    const winSize = this.window.getSize(); // 获取窗口宽高

    const x = this.screenSize.width - winSize[0];
    const y = 100;
    this.window.setPosition(x, y);
    this.window.setAlwaysOnTop(true, 'screen-saver', 1000);
    this.window.loadURL(getAppHTML('suspension'));
    onInit(this.window);

    this.window.on('resize', () => {
      if (!is.development) {
        // 禁止横向拖动改变大小
        // TODO 这里会造成抖动，但是 will-resize 不知怎么返回的 newBounds 不对，待解决
        if (this.window?.getSize()[0] !== winSize[0]) {
          this.window?.setBounds({
            width: winSize[0],
            height: winSize[1],
            x,
            y,
          });
        }
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
      if (!this.window.isVisible()) {
        this.window.show();
      }
    } else {
      this.init(this.option);
    }
  }

  hide() {
    if (this.window) {
      setTimeout(() => {
        this.window?.hide();
      }, 300);
    }
  }
}

export default SuspensionManager;
