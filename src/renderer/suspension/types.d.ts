import type { IMinionPropsWithNameAndID } from '@hbt-org/core';

export interface OpponentLineup {
  hero: string;
  turn: string;
  minions: IMinionPropsWithNameAndID[];
}
