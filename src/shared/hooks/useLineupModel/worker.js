/* eslint-disable no-restricted-globals */

import { Lineup } from '@hbt-org/core';

self.addEventListener('message', async (event) => {
  const minions = JSON.parse(event.data.minions);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _minions = Lineup.create(minions).minions;
  const finalLineup = await Lineup.getAllPossibleLineups(_minions);
  const combatPower = finalLineup.reduce(
    (acc, cur) => acc + cur.COMBAT_POWER,
    0
  );
  self.postMessage({
    minions: JSON.stringify(_minions),
    finalLineup: JSON.stringify(finalLineup),
    combatPower,
  });
});
