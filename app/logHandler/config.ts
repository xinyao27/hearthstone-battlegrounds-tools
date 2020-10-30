import { resolve } from 'path';

// Windows
// const heartstoneRootPath = 'D:\\Program Files (x86)\\Hearthstone';
// Mac os
const heartstoneRootPath = '/Applications/Hearthstone';
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
