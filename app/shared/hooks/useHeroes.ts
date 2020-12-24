import { createModel } from 'hox';

import heroes from '@shared/constants/heroes.json';

function useHeroes() {
  function getHeroId(name: string) {
    return heroes.find((hero) => hero.name === name)?.id ?? 0;
  }
  function getHero(id: number | string) {
    return heroes.find((hero) => hero.id === parseInt(<string>id, 10));
  }

  return { heroes, getHeroId, getHero };
}

export default createModel(useHeroes);
