import { remote, ipcRenderer } from 'electron';
import type { Sorted } from './parser';
import { LOGHANDLER_SUSPENSION_MESSAGE } from '../constants/topic';

/**
 * 负责将整理过的日志信息向外广播
 * @param source
 */
function manager(source: Sorted) {
  const { suspensionWindow } = remote.getGlobal('winIds');

  if (suspensionWindow !== undefined) {
    ipcRenderer.sendTo(suspensionWindow, LOGHANDLER_SUSPENSION_MESSAGE, source);
  }
}

export default manager;
