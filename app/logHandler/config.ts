import { resolve } from 'path';
import { is } from 'electron-util';

import { config } from '@app/store';

const configHeartstoneRootPath = config.get('heartstoneRootPath') as
  | string
  | undefined;
// Windows
const windowsHeartstoneRootPath =
  configHeartstoneRootPath ?? 'D:\\Program Files (x86)\\Hearthstone';
// Mac os
const macOSHeartstoneRootPath =
  configHeartstoneRootPath ?? '/Applications/Hearthstone';

// @ts-ignore
// eslint-disable-next-line consistent-return
const heartstoneRootPath = (() => {
  if (is.windows) return windowsHeartstoneRootPath;
  if (is.macos) return macOSHeartstoneRootPath;
  return windowsHeartstoneRootPath;
})();

const heartstonePowerLogFileName = 'Power.log';
const heartstonePowerLogFilePath = resolve(
  heartstoneRootPath,
  'Logs',
  heartstonePowerLogFileName
);
const heartstoneBoxLogFileName = 'LoadingScreen.log';
const heartstoneBoxLogFilePath = resolve(
  heartstoneRootPath,
  'Logs',
  heartstoneBoxLogFileName
);

export default {
  heartstoneRootPath,
  heartstonePowerLogFileName,
  heartstonePowerLogFilePath,
  heartstoneBoxLogFileName,
  heartstoneBoxLogFilePath,
};
