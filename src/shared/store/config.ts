import { RequestMethodReturnMap } from '@core/pages/settings/OBS/types'
import Store from 'electron-store'
import { is } from 'electron-util'

interface Config {
  suspensionBounds?: {
    x: number
    y: number
    width: number
    height: number
  }
  heartstoneRootPath?: string
  enableGameResult: boolean
  obs: {
    text: {
      enable?: boolean
      source?: RequestMethodReturnMap['GetSourcesList']['sources'][0]
      max: number
    }
    image: {
      enable?: boolean
      dir?: string
      max: number
    }
  }
  shortcuts: {
    unplug: string
  }
  rank: string
}

// 存储配置文件
export const config = {
  store: new Store<Config>({
    name: 'config',
    defaults: {
      heartstoneRootPath: is.windows
        ? 'C:\\Program Files (x86)\\Hearthstone'
        : is.macos
        ? '/Applications/Hearthstone'
        : '',
      enableGameResult: false,
      obs: {
        image: {
          max: 12,
        },
        text: {
          max: 12,
        },
      },
      shortcuts: {
        unplug: 'F1',
      },
      rank: 'all',
    },
  }),
  get<T = never>(key: keyof Config | string): T {
    return this.store.get(key)
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  set(key: string, payload: any): void {
    return this.store.set(key, payload)
  },
}
