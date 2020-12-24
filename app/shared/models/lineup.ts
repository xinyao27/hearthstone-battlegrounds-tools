import type { MinionProps } from '@shared/types';

import Minion from './minion';

export interface MinionWithPropsAndNameID {
  name: string;
  id: string;
  props: MinionProps;
}

class Lineup {
  public lineup: Minion[];

  // 战力 (整体)
  public COMBAT_POWER: number;

  constructor(lineup: MinionWithPropsAndNameID[]) {
    const LINEUP = lineup.map((v) => Minion.create(v.name, v.props));
    this.lineup = LINEUP;
    this.COMBAT_POWER = LINEUP.reduce((acc, cur) => acc + cur.COMBAT_POWER, 0);
  }

  static create(lineup: MinionWithPropsAndNameID[]) {
    return new Lineup(lineup);
  }
}

export default Lineup;
