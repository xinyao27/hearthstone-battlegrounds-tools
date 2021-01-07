import { createModel } from 'hox';

import { heroes } from '@hbt-org/core';

function useHeroes() {
  function getHeroId(name: string) {
    return heroes.find((hero) => hero.name === name)?.dbfId ?? 0;
  }
  function getHero(id: number | string) {
    return heroes.find((hero) => hero.dbfId === parseInt(<string>id, 10));
  }

  return { heroes, getHeroId, getHero };
}

export default createModel(useHeroes);
