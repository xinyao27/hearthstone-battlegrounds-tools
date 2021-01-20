import {
  app,
  Menu,
  Tray as ClassTray,
  nativeImage,
  nativeTheme,
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

  public tooltip = 'HBT: 炉石传说酒馆战棋插件';

  public tooltipBackup = 'HBT: 炉石传说酒馆战棋插件';

  constructor() {
    if (is.windows) {
      const iconPath = getAssetPath('icon.png');
      const icon = nativeImage.createFromPath(iconPath).resize({
        width: 20,
        height: 20,
      });
      tray = new ClassTray(icon);
    }
    if (is.macos) {
      const iconPath = getAssetPath(
        nativeTheme.shouldUseDarkColors ? 'mac_dark.png' : 'mac.png'
      );
      const icon = nativeImage.createFromPath(iconPath).resize({
        width: 18,
        height: 18,
      });
      tray = new ClassTray(icon);
    }
    this.tray = tray;

    this.bindEvent();

    this.tray.setToolTip(this.tooltip);

    this.getUser((user) => {
      if (user) {
        this.tooltip = `HBT: ${user.bnetTag}`;
        this.tooltipBackup = `HBT: ${user.bnetTag}`;
        this.tray.setToolTip(this.tooltip);
        this.buildMenu(this.getMenuTemplate());
      }
    });

    this.buildMenu(this.getMenuTemplate());

    if (is.macos) {
      this.subscribeMacThemeChange();
    }
  }

  private subscribeMacThemeChange() {
    nativeTheme.on('updated', () => {
      const iconPath = getAssetPath(
        nativeTheme.shouldUseDarkColors ? 'mac_dark.png' : 'mac.png'
      );
      const icon = nativeImage.createFromPath(iconPath).resize({
        width: 18,
        height: 18,
      });
      this.tray.setImage(icon);
    });
  }

  private getUser(cb: (user: User) => void) {
    const store = getStore();
    store.subscribe(Topic.SET_USER, (action) => {
      if (action.payload) {
        this.user = action.payload;
        cb(action.payload);
      }
    });
  }

  private getMenuTemplate() {
    const window: Array<MenuItemConstructorOptions | MenuItem> = [
      {
        label: '主界面',
        type: 'normal',
        click: () => {
          global.managers.coreManager?.show();
        },
      },
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
          app.exit();
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

  private bindEvent() {
    this.tray.on('double-click', () => {
      global.managers.coreManager?.show();
    });
  }

  public showUpdateDownloadProgress(percent: number) {
    this.tooltip = `${this.tooltipBackup}\n正在更新: ${percent}%`;
    this.tray.setToolTip(this.tooltip);
    if (percent === 100) {
      this.tray.setToolTip(this.tooltipBackup);
    }
  }

  public static init() {
    return new Tray();
  }
}

export default Tray;
