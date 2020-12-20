import React from 'react';
import { useMount } from 'ahooks';
import { createModel } from 'hox';

import { cache } from '@shared/store';
import type { CacheMinion } from '@shared/types';

function useMinions() {
  const [minions, setMinions] = React.useState<CacheMinion[]>([]);
  useMount(async () => {
    const data = await cache.getMinions();
    setMinions(data?.data ?? []);
  });

  function getMinionId(name: string) {
    return minions.find((hero) => hero.name === name)?.id ?? 0;
  }
  function getMinion(id: number | string) {
    return minions.find((hero) => hero.id === parseInt(<string>id, 10));
  }

  return { minions, getMinionId, getMinion };
}

export default createModel(useMinions);
