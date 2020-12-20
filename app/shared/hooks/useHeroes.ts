import React from 'react';
import { useMount } from 'ahooks';
import { createModel } from 'hox';

import { cache } from '@shared/store';
import type { CacheHero } from '@shared/types';

function useHeroes() {
  const [heroes, setHeroes] = React.useState<CacheHero[]>([]);
  useMount(async () => {
    const data = await cache.getHeroes();
    setHeroes(data?.data ?? []);
  });

  function getHeroId(name: string) {
    return heroes.find((hero) => hero.name === name)?.id ?? 0;
  }
  function getHero(id: number | string) {
    return heroes.find((hero) => hero.id === parseInt(<string>id, 10));
  }

  return { heroes, getHeroId, getHero };
}

export default createModel(useHeroes);
