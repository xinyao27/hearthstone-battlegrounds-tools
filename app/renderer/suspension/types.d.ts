import { Minion } from '@shared/types';

export interface OpponentLineup {
  hero: string;
  turn: string;
  minions: {
    name: string;
    id: string;
    props: Minion;
  }[];
}
