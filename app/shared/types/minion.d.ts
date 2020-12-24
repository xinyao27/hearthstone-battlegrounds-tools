// 从日志中读取到的 props
export interface MinionProps {
  // 攻击力
  ATK?: string;
  // 血量
  HEALTH?: string;
  // 站位（1-7位）
  ZONE_POSITION?: string;
  // 嘲讽
  TAUNT?: string;
  // 风怒
  WINDFURY?: string;
  // 圣盾
  DIVINE_SHIELD?: string;
  // 剧毒
  POISONOUS?: string;
  // 复生
  REBORN?: string;
  // 金色随从
  BACON_MINION_IS_LEVEL_TWO?: string;
  // 指 upgradeId 例如：63781
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
  IS_BACON_POOL_MINION?: string;
  // 光环
  AURA?: string;
  // 战吼
  BATTLECRY?: string;
  // 发现
  DISCOVER?: string;
  // 使用发现视角（应该是指发现动画）
  USE_DISCOVER_VISUALS?: string;
  // 奖金（应该是指三连奖励）
  PREMIUM?: string;

  [key: string]: string | undefined;
}

export interface Minion {
  official: boolean;
  ADAPT: number;
  additionalModel: string | number | null;
  AI_MUST_PLAY: number;
  artistName: string;
  ATK: number;
  AUTOATTACK: number;
  BATTLECRY: number;
  BOSS: number;
  cardClass: number;
  cardId: string;
  cardRace: number;
  cardSet: number;
  cardType: number;
  CASTSWHENDRAWN: number;
  CHARGE: number;
  childIds: number[] | null;
  CHOOSE_ONE: number;
  COMBO: number;
  CORRUPT: number;
  CORRUPTED: number;
  COUNTER: number;
  DEATHRATTLE: number;
  DISCOVER: number;
  DIVINE_SHIELD: number;
  DORMANT: number;
  DUNGEON_PASSIVE_BUFF: number;
  ECHO: number;
  EMPOWER: number;
  ENRAGED: number;
  EVILZUG: number;
  FATIGUE: number;
  flavorText: string;
  flavorTextI18n: string;
  FREEZE: number;
  GAME_START: number;
  GRIMY_GOONS: number;
  HEALTH: number;
  id: number;
  image: string;
  imageGold: string | null;
  IMMUNE: number;
  INSPIRE: number;
  isBacon: number;
  JADE_GOLEM: number;
  JADE_LOTUS: number;
  KABAL: number;
  LIFESTEAL: number;
  MAGNETIC: number;
  MEGA_WINDFURY: number;
  minionType: number;
  name: string;
  nameI18n: string;
  OUTCAST: number;
  OVERKILL: number;
  OVERLOAD: number;
  OVERLOAD_OWED: number;
  POISONOUS: number;
  QUEST: number;
  REBORN: number;
  RECRUIT: number;
  RUSH: number;
  SECRET: number;
  SHRINE: number;
  SIDEQUEST: number;
  SILENCE: number;
  slug: string | null;
  SPARE_PART: number;
  SPELLBURST: number;
  SPELLPOWER: number;
  START_OF_COMBAT: number;
  STEALTH: number;
  TAUNT: number;
  text: string;
  textI18n: string;
  textSimple: string;
  tier: number;
  TWINSPELL: number;
  UNTOUCHABLE: number;
  upgradeCardId: string;
  upgradeId: number | null;
  WINDFURY: number;
}
