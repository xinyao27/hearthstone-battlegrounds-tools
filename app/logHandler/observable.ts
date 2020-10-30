import fs from 'fs';
import { bindNodeCallback } from 'rxjs';

import config from './config';

const open = bindNodeCallback(fs.open);
const watchFile = bindNodeCallback(fs.watchFile);
const readFile = bindNodeCallback(fs.readFile);

/**
 * 读取 Log 创建 Observable
 */
function createObservable() {
  return readFile(config.heartstoneLogFilePath);
}

export default createObservable;
