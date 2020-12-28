import React from 'react';
import { createModel } from 'hox';
import useDeepCompareEffect from 'use-deep-compare-effect';
import type { IHero } from '@hbt-org/core';

import useHeroes from '@shared/hooks/useHeroes';

import useStateFlow from './useStateFlow';

function useCurrentHero() {
  const [stateFlow] = useStateFlow();
  const { getHeroId, getHero } = useHeroes();
  const [hero, setHero] = React.useState<IHero | null>(null);
  const [rank, setRank] = React.useState<string>('8');

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

  const handleReset = React.useCallback(() => {
    setHero(null);
    setRank('8');
  }, []);

  return {
    hero,
    rank,
    reset: handleReset,
  };
}

export default createModel(useCurrentHero);
