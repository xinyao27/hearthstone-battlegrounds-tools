import * as math from 'mathjs';

interface Data {
  tier: number;
  ATK: number;
  HEALTH: number;
  TAUNT: number | boolean;
  WINDFURY: number | boolean;
  DIVINE_SHIELD: number | boolean;
  POISONOUS: number | boolean;
  REBORN: number | boolean;
  additionalModel?: string;
}

function convertToNumber(data: any): number {
  if (data) {
    return 1;
  }
  if (!data) {
    return 0;
  }
  return 0;
}
export const model = `COMBAT_POWER = (sqrt(ATK * HEALTH) + TAUNT * (ceil(HEALTH / (tier + 1)) * 0.5) + WINDFURY * (ATK * 0.5 * 0.5) + DIVINE_SHIELD * (sqrt(ATK)) + POISONOUS * (((tier + 1) + HEALTH) / 2)) + REBORN * (sqrt(ATK * 1) + TAUNT * (ceil(1 / (tier + 1)) * 0.5) + WINDFURY * (ATK * 0.5 * 0.5) + DIVINE_SHIELD * (sqrt(ATK)) + POISONOUS * (((tier + 1) + 1) / 2))`;
export function getSingleCombatPower(
  data: Data,
  {
    baseModel = model,
    additionalModel,
  }: {
    baseModel?: string;
    additionalModel?: string;
  } = {
    baseModel: model,
  }
): number {
  try {
    data.TAUNT = convertToNumber(data.TAUNT);
    data.WINDFURY = convertToNumber(data.WINDFURY);
    data.DIVINE_SHIELD = convertToNumber(data.DIVINE_SHIELD);
    data.POISONOUS = convertToNumber(data.POISONOUS);
    data.REBORN = convertToNumber(data.REBORN);

    math.evaluate(baseModel, data);
    if (data.additionalModel || additionalModel) {
      math.evaluate(
        // @ts-ignore
        `COMBAT_POWER = ${data.singleCombatPower} + ${
          additionalModel || data.additionalModel
        }`,
        data
      );
    }
    // @ts-ignore
    if (typeof data.COMBAT_POWER === 'number') {
      // @ts-ignore
      return Math.round(data.COMBAT_POWER * 100);
    }
    return NaN;
  } catch (e) {
    return NaN;
  }
}
