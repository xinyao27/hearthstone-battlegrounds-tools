import { remote } from 'electron';

import heroes from '@shared/constants/heroes.json';
import minions from '@shared/constants/minions.json';

export function getHeroId(name: string) {
  return heroes.find((hero) => hero.name === name)?.id ?? 0;
}
export function getHero(id: number | string) {
  return heroes.find(
    (hero) => parseInt(hero.id, 10) === parseInt(<string>id, 10)
  );
}
export function getMinionId(name: string) {
  return minions.find((hero) => hero.name === name)?.id ?? 0;
}
export function getMinion(id: number | string) {
  return minions.find(
    (hero) => parseInt(hero.id, 10) === parseInt(<string>id, 10)
  );
}
export function getImageUrl(base: string) {
  return `https://hs.chenyueban.com${base}`;
}

const { suspensionManager } = remote.getGlobal('managers');
export function showSuspension() {
  suspensionManager?.show();
}
export function hideSuspension() {
  suspensionManager?.hide();
}
