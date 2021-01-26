/* eslint-disable @typescript-eslint/no-explicit-any */
import CoreManager from '@main/windows/CoreManager'
import LogHandlerManager from '@main/windows/LogHandlerManager'
import SuspensionManager from '@main/windows/SuspensionManager'
import LoginManager from '@main/windows/LoginManager'
import Store from '@shared/store/store'

declare module '*.jpg'
declare module '*.jpeg'
declare module '*.png'
declare module '*.gif'
declare module '*.webp'
declare module '*.ico'
declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor()
  }
  export default WebpackWorker
}
declare global {
  namespace NodeJS {
    interface Global {
      managers: {
        coreManager: CoreManager | null
        logHandlerManager: LogHandlerManager | null
        suspensionManager: SuspensionManager | null
        loginManager: LoginManager | null
      }
      store: Store<any>
    }
  }
}

export interface LogData<S = string, R = any> {
  type: 'box' | 'state'
  date: string
  state: S
  original: string
  result: R
}
