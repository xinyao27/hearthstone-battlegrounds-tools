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

export interface Minion {
  // 攻击力
  ATK?: string;
  // 血量
  HEALTH?: string;
  // 站位（1-7位）
  ZONE_POSITION?: '1';
  // 嘲讽
  TAUNT?: '1';
  // 风怒
  WINDFURY?: '1';
  // 圣盾
  DIVINE_SHIELD?: '1';
  // 剧毒
  POISONOUS?: '1';
  // 金色随从
  BACON_MINION_IS_LEVEL_TWO?: '1';
  // 指 upgradeId 见 minions.json 例如：63781
  '1429'?: string;
  // 随从星级 1-6
  COST?: string;
  // 种族（野兽、鱼人、龙、融合怪等等）
  CARDRACE?:
    | 'DEMON'
    | 'PIRATE'
    | 'MECH'
    | 'DRAGON'
    | 'PET'
    | 'MURLOC'
    | 'ELEMENTAL'
    | 'ALL';
  // 酒馆等级 1-6
  TECH_LEVEL?: string;
  // 是否为酒馆内的随从？
  IS_BACON_POOL_MINION?: '1';
  // 光环
  AURA?: '1';
  // 战吼
  BATTLECRY?: '1';
  // 发现
  DISCOVER?: '1';
  // 使用发现视角（应该是指发现动画）
  USE_DISCOVER_VISUALS?: '1';
  // 奖金（应该是指三连奖励）
  PREMIUM?: '1';
}

export interface LogData<S = string, R = any> {
  type: 'box' | 'state';
  date: string;
  state: S;
  original: string;
  result: R;
}
