import { createModel } from 'hox';
import { useLocalStorageState } from 'ahooks';

import heros from '../constants/heros.json';

export interface RecordItem {
  id: string;
  hero: {
    id: number;
    name: string;
  };
  rank: string;
  date: string | Date;
}
export interface ResultItem {
  heroId: number;
  heroAvatar: string;
  heroName: string;
  ranks: {
    rank: string;
    date: string;
  }[];
  averageRanking: number;
  selectRate: number;
}

function useStatistics() {
  const [recordList] = useLocalStorageState<RecordItem[]>('record-list', []);

  const reSummarized = recordList.reduce<{
    [key: number]: {
      rank: string;
      date: string | Date;
    }[];
  }>((pre, cur) => {
    const key = cur.hero.id;
    const preRanks = pre[key];
    const newRanks = [...(preRanks || []), { rank: cur.rank, date: cur.date }];
    return {
      ...pre,
      [key]: newRanks,
    };
  }, {});

  return Object.keys(reSummarized)
    .reduce<ResultItem[]>((pre, cur) => {
      const heroId = parseInt(cur, 10);
      const hero = heros.find((v) => v.id === heroId);
      const heroAvatar = hero ? hero.battlegrounds.image : '';
      const heroName = hero ? hero.name : '';
      const ranks = reSummarized[heroId];
      const averageRanking = (
        ranks.reduce((acc, _cur) => acc + parseInt(_cur.rank, 10), 0) /
        ranks.length
      ).toFixed(2);
      const selectRate = ranks.length / recordList.length;

      const currentItem = {
        heroId,
        heroAvatar,
        heroName,
        ranks,
        averageRanking,
        selectRate,
      };
      return [...pre, currentItem] as ResultItem[];
    }, [])
    .sort((a, b) => a.averageRanking - b.averageRanking);
}

export default createModel(useStatistics);
