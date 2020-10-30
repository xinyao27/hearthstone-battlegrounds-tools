import { resolve } from 'path';

const heartstoneRootPath = 'D:\\Program Files (x86)\\Hearthstone';
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
