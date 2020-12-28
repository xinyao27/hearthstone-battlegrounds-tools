import React from 'react';
import { useBoolean } from 'ahooks';
import { Lineup, Minion, IMinionPropsWithNameAndID } from '@hbt-org/core';

function useLineupModel(list?: IMinionPropsWithNameAndID[]) {
  const [minions, setMinions] = React.useState<Minion[]>([]);
  const [finalLineup, setFinalLineup] = React.useState<Minion[]>([]);
  const [combatPower, setCombatPower] = React.useState<number>(0);
  const [loading, { toggle: toggleLoading }] = useBoolean(false);

  React.useEffect(() => {
    (async () => {
      if (Array.isArray(list)) {
        toggleLoading(true);

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const _minions = Lineup.create(list).minions;
        setMinions(_minions);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const _finalLineup = await Lineup.getAllPossibleLineups(_minions);
        setFinalLineup(_finalLineup);
        const COMBAT_POWER = _finalLineup.reduce(
          (acc, cur) => acc + cur.COMBAT_POWER,
          0
        );
        setCombatPower(COMBAT_POWER);

        toggleLoading(false);
      }
    })();
  }, [list, toggleLoading]);

  return {
    minions,
    finalLineup,
    combatPower,
    loading,
  };
}

export default useLineupModel;
