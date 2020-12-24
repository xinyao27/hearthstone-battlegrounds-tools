export interface Hero {
  official: boolean | null;
  cardClass: number;
  cardId: string;
  cardRace: number;
  cardSet: number;
  cardType: number;
  HEALTH: number;
  id: number;
  image: string;
  name: string;
  nameI18n: string;
  skillIds: number[];
  slug: string;
}
