import React from 'react';
import { useMount } from 'ahooks';
import { createModel } from 'hox';

import { cache } from '@shared/store';
import minionsBackup from '@shared/constants/minions.json';
import type { Minion } from '@shared/types';

function useMinions() {
  const [minions, setMinions] = React.useState<Minion[]>(minionsBackup);
  useMount(async () => {
    const data = await cache.getMinions();
    setMinions(data?.data ?? minionsBackup);
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
