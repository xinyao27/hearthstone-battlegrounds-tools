import type { MinionProps } from '@shared/types';
import minions from '../constants/minions.json';
// import minions from '@shared/constants/minions.json';

import { getSingleCombatPower } from './utils';

enum Race {
  // 中立
  NEUTRAL = 0,
  // 所有种族
  ALL = 1,
  // 鱼人
  MURLOC = 14,
  // 恶魔
  DEMON = 15,
  // 机械
  MECH = 17,
  // 元素
  ELEMENTAL = 18,
  // 野兽
  PET = 20,
  // 海盗
  PIRATE = 23,
  // 龙
  DRAGON = 24,
}

class Minion {
  public id: number;

  public name: string;

  public tier: number;

  // 攻击力
  public ATK: number;

  // 血量
  public HEALTH: number;

  // 种族
  public RACE: Race;

  // 嘲讽
  public TAUNT: boolean;

  // 风怒
  public WINDFURY: boolean;

  // 圣盾
  public DIVINE_SHIELD: boolean;

  // 剧毒
  public POISONOUS: boolean;

  // 复生
  public REBORN: boolean;

  // 亡语
  public DEATHRATTLE: any[];

  // 功能性 (多指喷子这种的特殊效果)
  public FEATURE: () => void;

  // 战力 (单体)
  public COMBAT_POWER: number;

  constructor(name: string, props: MinionProps) {
    const minionTemplate = this.getMinion(name);
    const minion = {
      id: minionTemplate?.id ?? 0,
      name,
      tier: minionTemplate?.tier ?? 0,
      ATK: props.ATK ? parseInt(props.ATK, 10) : 0,
      HEALTH: props.HEALTH ? parseInt(props.HEALTH, 10) : 0,
      RACE: props.CARDRACE ? Race[props.CARDRACE] : 0,
      TAUNT: !!props.TAUNT,
      WINDFURY: !!props.WINDFURY,
      DIVINE_SHIELD: !!props.DIVINE_SHIELD,
      POISONOUS: !!props.POISONOUS,
      REBORN: !!props.REBORN,
      DEATHRATTLE: [],
      FEATURE: () => {},
    };
    this.id = minion.id;
    this.name = minion.name;
    this.tier = minion.tier;
    this.ATK = minion.ATK;
    this.HEALTH = minion.HEALTH;
    this.RACE = minion.RACE;
    this.TAUNT = minion.TAUNT;
    this.WINDFURY = minion.WINDFURY;
    this.DIVINE_SHIELD = minion.DIVINE_SHIELD;
    this.POISONOUS = minion.POISONOUS;
    this.REBORN = minion.REBORN;
    this.DEATHRATTLE = minion.DEATHRATTLE;
    this.FEATURE = minion.FEATURE;
    this.COMBAT_POWER = getSingleCombatPower(minion);
  }

  static create(name: string, props: MinionProps) {
    return new Minion(name, props);
  }

  getMinion(name: string) {
    return minions.find((hero) => hero.name === name);
  }

  valueOf() {
    return {
      id: this.id,
      name: this.name,
      tier: this.tier,
      ATK: this.ATK,
      HEALTH: this.HEALTH,
      RACE: this.RACE,
      TAUNT: this.TAUNT,
      WINDFURY: this.WINDFURY,
      DIVINE_SHIELD: this.DIVINE_SHIELD,
      POISONOUS: this.POISONOUS,
      REBORN: this.REBORN,
      DEATHRATTLE: this.DEATHRATTLE,
      FEATURE: this.FEATURE,
      COMBAT_POWER: this.COMBAT_POWER,
    };
  }
}

export default Minion;
