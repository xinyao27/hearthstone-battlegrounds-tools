import { resolve } from 'path'
import { is } from 'electron-util'

import { config } from '@shared/store'

const Config = {
  get configHeartstoneRootPath(): string | undefined {
    return config.get('heartstoneRootPath') as string | undefined
  },

  get windowsHeartstoneRootPath(): string {
    return (
      this.configHeartstoneRootPath ?? 'C:\\Program Files (x86)\\Hearthstone'
    )
  },

  get macOSHeartstoneRootPath(): string {
    return this.configHeartstoneRootPath ?? '/Applications/Hearthstone'
  },

  get heartstoneRootPath(): string {
    if (is.windows) return this.windowsHeartstoneRootPath
    if (is.macos) return this.macOSHeartstoneRootPath
    return this.windowsHeartstoneRootPath
  },

  get heartstonePowerLogFileName(): string {
    return 'Power.log'
  },

  get heartstonePowerLogFilePath(): string {
    return resolve(
      this.heartstoneRootPath,
      'Logs',
      this.heartstonePowerLogFileName
    )
  },

  get heartstoneBoxLogFileName(): string {
    return 'LoadingScreen.log'
  },

  get heartstoneBoxLogFilePath(): string {
    return resolve(
      this.heartstoneRootPath,
      'Logs',
      this.heartstoneBoxLogFileName
    )
  },
}

export default Config
