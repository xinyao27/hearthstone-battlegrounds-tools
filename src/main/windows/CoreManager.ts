import { EventEmitter } from 'events'
import {
  app,
  BrowserWindow,
  shell,
  BrowserWindowConstructorOptions,
} from 'electron'
import { is } from 'electron-util'

import { getAppHTML, getAssetPath } from '../utils'

interface Params {
  onInit: (window: BrowserWindow) => void
  onDestroy?: () => void
}

class CoreManager extends EventEmitter {
  option: BrowserWindowConstructorOptions

  window: BrowserWindow | null

  constructor({ onInit, onDestroy }: Params) {
    super()

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
    }
    if (is.windows) {
      defaultOptions.frame = false
    }
    this.option = defaultOptions
    this.window = null
    this.init(this.option, onInit, onDestroy)
  }

  init(
    options: BrowserWindowConstructorOptions,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onInit: Params['onInit'] = () => {},
    onDestroy?: Params['onDestroy']
  ): void {
    this.window = new BrowserWindow(options)
    if (is.macos) {
      app.dock.setIcon(getAssetPath('icon.png'))
    }
    this.window.loadURL(getAppHTML())
    onInit(this.window)

    this.window.webContents.on('did-finish-load', () => {
      if (!this.window) {
        throw new Error('`coreWindow` is not defined')
      }
      if (process.env.START_MINIMIZED) {
        this.window.minimize()
      } else {
        this.window.show()
      }
    })

    // Open urls in the user's browser
    this.window.webContents.on('new-window', (event, url) => {
      event.preventDefault()
      shell.openExternal(url)
    })

    this.window.on('close', (e) => {
      if (is.macos) {
        e.preventDefault()
        this.hide()
      }
    })

    this.window.on('closed', () => {
      this.window = null
      onDestroy?.()
    })

    if (is.macos) {
      this.window?.webContents.on('before-input-event', (event, input) => {
        if (input.meta && input.key.toLowerCase() === 'q') {
          event.preventDefault()
          app.quit()
          app.exit()
        }
      })
    }
  }

  destroy(): void {
    this.window?.destroy()
  }

  show(): void {
    if (this.window) {
      if (this.window.isMinimized()) this.window.restore()
      this.window.show()
    }
  }

  hide(): void {
    if (this.window) {
      this.window.hide()
    }
  }

  minimize(): void {
    if (this.window) {
      this.window.minimize()
    }
  }
}

export default CoreManager
