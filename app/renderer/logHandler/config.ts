import { resolve } from 'path';
import { is } from 'electron-util';

import { config } from '@shared/store';

const Config = {
  get configHeartstoneRootPath() {
    return config.get('heartstoneRootPath') as string | undefined;
  },

  get windowsHeartstoneRootPath() {
    return (
      this.configHeartstoneRootPath ?? 'C:\\Program Files (x86)\\Hearthstone'
    );
  },

  get macOSHeartstoneRootPath() {
    return this.configHeartstoneRootPath ?? '/Applications/Hearthstone';
  },

  get heartstoneRootPath() {
    if (is.windows) return this.windowsHeartstoneRootPath;
    if (is.macos) return this.macOSHeartstoneRootPath;
    return this.windowsHeartstoneRootPath;
  },

  get heartstonePowerLogFileName() {
    return 'Power.log';
  },

  get heartstonePowerLogFilePath() {
    return resolve(
      this.heartstoneRootPath,
      'Logs',
      this.heartstonePowerLogFileName
    );
  },

  get heartstoneBoxLogFileName() {
    return 'LoadingScreen.log';
  },

  get heartstoneBoxLogFilePath() {
    return resolve(
      this.heartstoneRootPath,
      'Logs',
      this.heartstoneBoxLogFileName
    );
  },
};

export default Config;
