import { EventEmitter } from 'events';
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

import { getStore } from '../../shared/store';
import { Topic } from '../../shared/constants/topic';

interface Params {
  url: string;
  onInit: (window: BrowserWindow) => void;
  onDestroy?: () => void;
}

class LoginManager extends EventEmitter {
  option: BrowserWindowConstructorOptions;

  window: BrowserWindow | null;

  constructor({ url, onInit, onDestroy }: Params) {
    super();

    this.option = {
      width: 600,
      height: 600,
      title: '战网登录',
      resizable: false,
      minimizable: false,
      maximizable: false,
      webPreferences: {
        devTools: false,
      },
    };
    this.window = null;
    this.init(url, this.option, onInit, onDestroy);
  }

  init(
    url: string,
    options: BrowserWindowConstructorOptions,
    onInit: Params['onInit'] = () => {},
    onDestroy?: Params['onDestroy']
  ) {
    this.window = new BrowserWindow(options);
    this.window.loadURL(url);
    onInit(this.window);

    const content = this.window.webContents;

    content.on('did-redirect-navigation', (_, newUrl) => {
      const [, search] = newUrl.split('?');
      if (search) {
        const [key, token] = search?.split('=');
        // 成功拿到 token
        if (key === 'token' && token) {
          const store = getStore();
          store.dispatch<Topic.SET_TOKEN>({
            type: Topic.SET_TOKEN,
            payload: token,
          });
          this.destroy();
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
}

export default LoginManager;
