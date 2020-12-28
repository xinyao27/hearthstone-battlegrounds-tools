import CoreManager from '@main/windows/CoreManager';
import LogHandlerManager from '@main/windows/LogHandlerManager';
import SuspensionManager from '@main/windows/SuspensionManager';
import Store from '@shared/store/store';

declare module '*.jpg' {
  const value: any;
  export = value;
}
declare module '*.jpeg' {
  const value: any;
  export = value;
}
declare module '*.png' {
  const value: any;
  export = value;
}
declare module '*.gif' {
  const value: any;
  export = value;
}
declare module '*.webp' {
  const value: any;
  export = value;
}
declare module '*.ico' {
  const value: any;
  export = value;
}
declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor();
  }
  export default WebpackWorker;
}
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      managers: {
        coreManager: CoreManager | null;
        logHandlerManager: LogHandlerManager | null;
        suspensionManager: SuspensionManager | null;
      };
      store: Store<any>;
    }
  }
}

export interface LogData<S = string, R = any> {
  type: 'box' | 'state';
  date: string;
  state: S;
  original: string;
  result: R;
}
