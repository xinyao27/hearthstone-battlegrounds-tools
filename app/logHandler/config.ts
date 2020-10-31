import { resolve } from 'path';
import { getPlatform, Platform } from '../utils';

// Windows
const windowsHeartstoneRootPath = 'D:\\Program Files (x86)\\Hearthstone';
// Mac os
const macOSHeartstoneRootPath = '/Applications/Hearthstone';

// @ts-ignore
// eslint-disable-next-line consistent-return
const heartstoneRootPath = (() => {
  const platform = getPlatform();
  if (platform === Platform.WINDOWS) return windowsHeartstoneRootPath;
  if (platform === Platform.MACOS) return macOSHeartstoneRootPath;
  return windowsHeartstoneRootPath;
})();
const heartstoneLogFileName = 'Power.log';
const heartstoneLogFilePath = resolve(
  heartstoneRootPath,
  'Logs',
  heartstoneLogFileName
);

export default {
  heartstoneRootPath,
  heartstoneLogFileName,
  heartstoneLogFilePath,
};
