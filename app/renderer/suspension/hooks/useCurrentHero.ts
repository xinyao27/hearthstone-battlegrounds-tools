import React from 'react';
import { createModel } from 'hox';
import useDeepCompareEffect from 'use-deep-compare-effect';

import heroes from '@shared/constants/heroes.json';
import { getHero, getHeroId } from '@suspension/utils';

import useStateFlow from './useStateFlow';

type Hero = typeof heroes[0];
type HeroRank = string;

function useCurrentHero() {
  const [stateFlow] = useStateFlow();
  const [hero, setHero] = React.useState<Hero>();
  const [rank, setRank] = React.useState<HeroRank>('8');

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
  }, [stateFlow]);

  return {
    hero,
    rank,
  };
}

export default createModel(useCurrentHero);
