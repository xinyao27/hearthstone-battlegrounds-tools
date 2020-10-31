import { ipcRenderer } from 'electron';
import type { Sorted } from './parser';
import { LOGHANDLER_MAIN_MESSAGE } from '../constants/topic';

/**
 * 负责将整理过的日志信息向外广播
 * @param source
 */
function manager(source: Sorted) {
  ipcRenderer.send(LOGHANDLER_MAIN_MESSAGE, source);
}

export default manager;
