import React from 'react';
import { createModel } from 'hox';
import { useBoolean, useMount, useRequest } from 'ahooks';
import { ajax } from 'rxjs/ajax';

import { cache } from '@shared/store';
import { CacheHeroData, CacheMinionData } from '@shared/types';

function getNewHeroes() {
  return ajax
    .getJSON<CacheHeroData>(`https://hs.chenyueban.com/api/heroes?all=true`)
    .toPromise<CacheHeroData>();
}
function getNewMinions() {
  return ajax
    .getJSON<CacheMinionData>(`https://hs.chenyueban.com/api/minions?all=true`)
    .toPromise<CacheMinionData>();
}

function useCache() {
  const [loading, { toggle: toggleLoading }] = useBoolean(false);
  const [error, setError] = React.useState();
  const { run: getNewHeroesData, error: newHeroesError } = useRequest(
    getNewHeroes,
    {
      cacheKey: 'newHeroes',
      cacheTime: 24 * 60 * 60 * 1000,
      manual: true,
    }
  );
  const { run: getNewMinionsData, error: newMinionsError } = useRequest(
    getNewMinions,
    {
      cacheKey: 'newMinions',
      cacheTime: 24 * 60 * 60 * 1000,
      manual: true,
    }
  );
  useMount(async () => {
    try {
      toggleLoading(true);
      const newHeroes = await getNewHeroesData();
      const newMinions = await getNewMinionsData();
      if (newHeroes && newMinions) {
        const cacheHeroes = await cache.getHeroes();
        const cacheMinions = await cache.getMinions();
        if (!cacheHeroes || cacheHeroes.version !== newHeroes.version) {
          await cache.updateHeroes(newHeroes);
        }
        if (!cacheMinions || cacheMinions.version !== newMinions.version) {
          await cache.updateMinions(newMinions);
        }
      }
      toggleLoading(false);
    } catch (e) {
      setError(e);
      toggleLoading(false);
    }
  });

  return {
    loading,
    error: error || newHeroesError || newMinionsError,
  };
}

export default createModel(useCache);
