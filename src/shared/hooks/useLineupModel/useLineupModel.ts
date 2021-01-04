/* eslint-disable @typescript-eslint/naming-convention,import/no-webpack-loader-syntax */
import React from 'react';
import { useBoolean, useDebounceEffect } from 'ahooks';
import { Minion, IMinionPropsWithNameAndID } from '@hbt-org/core';

// @ts-ignore
import LineupWorker from 'worker-loader!./worker';

function useLineupModel(list?: IMinionPropsWithNameAndID[]) {
  const [minions, setMinions] = React.useState<Minion[]>([]);
  const [finalLineup, setFinalLineup] = React.useState<Minion[]>([]);
  const [combatPower, setCombatPower] = React.useState<number>(0);
  const [loading, { toggle: toggleLoading }] = useBoolean(false);

  useDebounceEffect(
    () => {
      if (Array.isArray(list) && list.length) {
        toggleLoading(true);
        const worker: Worker = new LineupWorker();
        worker.postMessage({ minions: JSON.stringify(list) });
        worker.addEventListener('message', (event) => {
          const _minions: Minion[] = JSON.parse(event.data.minions);
          const _finalLineup: Minion[] = JSON.parse(event.data.finalLineup);
          const _combatPower: number = event.data.combatPower;
          setMinions(_minions);
          setFinalLineup(_finalLineup);
          setCombatPower(_combatPower);

          toggleLoading(false);
          worker.terminate();
        });
        worker.addEventListener('messageerror', () => {
          toggleLoading(false);
          worker.terminate();
        });

        return () => {
          toggleLoading(false);
          worker.terminate();
        };
      }

      return () => {
        toggleLoading(false);
      };
    },
    [list],
    { wait: 100 }
  );

  return {
    minions,
    finalLineup,
    combatPower,
    loading,
  };
}

export default useLineupModel;
