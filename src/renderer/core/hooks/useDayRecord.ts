import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { minBy } from 'lodash';

import useRecord from '@core/hooks/useRecord';
import type { RecordItem } from '@core/hooks/useStatistics';
import useHeroes from '@shared/hooks/useHeroes';

interface Data {
  data: RecordItem[];
  count: number;
  averageRanking: number;
}
interface FormattedData {
  [key: string]: Data;
}

function useDayRecord(currentDate?: Dayjs) {
  const { heroes } = useHeroes();
  const [recordList] = useRecord();
  const data = React.useMemo(() => {
    return recordList.filter((v) =>
      dayjs(v.date).isSame(currentDate || dayjs(), 'day')
    );
  }, [recordList, currentDate]);
  const formattedData = React.useMemo<FormattedData>(() => {
    return data.reduce<FormattedData>((acc, cur) => {
      const currentHeroId = cur.hero?.id;
      const currentHeroes = acc[currentHeroId];

      const heroData = [...(currentHeroes?.data ?? []), cur];
      const count = heroData.length;
      const averageRanking =
        heroData.reduce((sum, v) => sum + parseInt(v.rank, 10), 0) / count;

      return {
        ...acc,
        [currentHeroId]: {
          data: heroData,
          count,
          averageRanking,
        },
      };
    }, {});
  }, [data]);
  const best = React.useMemo<
    | (Data & {
        name: string;
        avatar: string;
      })
    | null
  >(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const value = minBy(
      Object.keys(formattedData).map((key) => formattedData[key]),
      (v) => v.averageRanking
    )!;
    if (value) {
      const currentHero = heroes.find(
        (v) => v.id === value.data?.[0]?.hero?.id
      );
      return Object.assign(value, {
        name: currentHero?.name ?? '',
        avatar: currentHero?.image ?? '',
      });
    }
    return null;
  }, [formattedData, heroes]);

  return {
    data,
    formattedData,
    best,
  };
}

export default useDayRecord;
