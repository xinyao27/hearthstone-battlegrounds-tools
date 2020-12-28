import { createModel } from 'hox';

import { minions } from '@hbt-org/core';

function useMinions() {
  function getMinionId(name: string) {
    return minions.find((hero) => hero.name === name)?.id ?? 0;
  }
  function getMinion(id: number | string) {
    return minions.find((hero) => hero.id === parseInt(<string>id, 10));
  }

  return { minions, getMinionId, getMinion };
}

export default createModel(useMinions);
