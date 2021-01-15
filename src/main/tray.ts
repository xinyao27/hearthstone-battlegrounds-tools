import {
  app,
  Menu,
  Tray as ClassTray,
  MenuItem,
  MenuItemConstructorOptions,
} from 'electron';
import { is } from 'electron-util';

import { getAssetPath } from './utils';
import { getStore } from '../shared/store';
import { Topic } from '../shared/constants/topic';
import type { User } from '../shared/api';

/**
 * 托盘
 */
let tray: ClassTray;
class Tray {
  public tray: ClassTray;

  public user: User | null = null;

  constructor() {
    const iconPath = getAssetPath(is.windows ? 'icon.ico' : 'icon.png');
    tray = new ClassTray(iconPath);
    this.tray = tray;

    this.tray.setToolTip('HBT: 炉石传说酒馆战棋插件');
    this.getUser((user) => {
      if (user) {
        this.tray.setToolTip(`HBT: ${user.bnetTag}`);
        this.buildMenu(this.getMenuTemplate());
      }
    });
    this.buildMenu(this.getMenuTemplate());
  }

  private getUser(cb: (user: User) => void) {
    const store = getStore();
    store.subscribe<Topic.SET_USER>((action) => {
      if (action.type === Topic.SET_USER && action.payload) {
        this.user = action.payload;
        cb(action.payload);
      }
    });
  }

  private getMenuTemplate() {
    const window: Array<MenuItemConstructorOptions | MenuItem> = [
      { label: '主界面', type: 'normal' },
      { label: '设置', type: 'normal' },
      { label: '切换悬浮框', type: 'normal' },
      { type: 'separator' },
    ];
    const user: Array<MenuItemConstructorOptions | MenuItem> = this.user
      ? [
          { label: this.user?.bnetTag, type: 'normal', enabled: false },
          { type: 'separator' },
        ]
      : [];
    const logout: Array<MenuItemConstructorOptions | MenuItem> = [
      {
        label: '退出 HBT',
        type: 'normal',
        click: () => {
          app.quit();
        },
      },
    ];
    const template: Array<MenuItemConstructorOptions | MenuItem> = [
      ...window,
      ...user,
      ...logout,
    ];

    return template;
  }

  private buildMenu(template: Array<MenuItemConstructorOptions | MenuItem>) {
    const contextMenu = Menu.buildFromTemplate(template);
    this.tray.setContextMenu(contextMenu);
  }

  public static init() {
    return new Tray();
  }
}

export default Tray;
