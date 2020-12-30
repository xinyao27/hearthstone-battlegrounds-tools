import React from 'react';
import { createModel } from 'hox';
import useDeepCompareEffect from 'use-deep-compare-effect';
import type { IHero } from '@hbt-org/core';
import { cloneDeep } from 'lodash';
import { useDebounceFn } from 'ahooks';

import { getStore } from '@shared/store';
import useHeroes from '@shared/hooks/useHeroes';
import { Topic } from '@shared/constants/topic';
import useStateFlow from '@suspension/hooks/useStateFlow';
import useBoxFlow from '@suspension/hooks/useBoxFlow';

const store = getStore();

function useCurrentHero() {
  const [stateFlow] = useStateFlow();
  const [boxFlow] = useBoxFlow();
  const { getHeroId, getHero } = useHeroes();
  const [hero, setHero] = React.useState<IHero | null>(null);
  const [rank, setRank] = React.useState<string>('8');

  const handleReset = React.useCallback(() => {
    setHero(null);
    setRank('8');
  }, []);

  useDeepCompareEffect(() => {
    if (stateFlow?.HERO_CHOICES?.result) {
      const [heroName] = stateFlow.HERO_CHOICES.result;
      const heroId = getHeroId(heroName);
      const heroData = getHero(heroId);

      if (heroData) {
        setHero(heroData);
        if (stateFlow.GAME_RANKING?.result) {
          const rankData = stateFlow.GAME_RANKING.result;
          setRank(rankData);
        }
      }
    }
  }, [stateFlow || {}, getHeroId, getHero]);

  // 战绩发送至 core 添加战绩
  const { run } = useDebounceFn(
    (_hero, _rank, _stateFlow) => {
      if (hero && rank) {
        const date = new Date();
        const record = {
          hero: _hero,
          rank: _rank,
          date,
          lineup: cloneDeep(_stateFlow?.LINEUP?.result?.own),
        };
        store.dispatch<Topic.ADD_RECORD>({
          type: Topic.ADD_RECORD,
          payload: record,
        });
        handleReset();
      }
    },
    { wait: 100 }
  );

  useDeepCompareEffect(() => {
    if (boxFlow?.current === 'BOX_GAME_OVER') {
      run(hero, rank, stateFlow);
    }
  }, [boxFlow || {}, stateFlow || {}, hero, rank]);

  return {
    hero,
    rank,
    reset: handleReset,
  };
}

export default createModel(useCurrentHero);
