/* eslint-disable @typescript-eslint/naming-convention,import/no-webpack-loader-syntax */
import React from 'react';
import { useBoolean, useDebounceFn } from 'ahooks';
import { Minion, IMinionPropsWithNameAndID } from '@hbt-org/core';
import { cloneDeep } from 'lodash';
import useDeepCompareEffect from 'use-deep-compare-effect';

// @ts-ignore
import LineupWorker from 'worker-loader!./worker';

let singleWorker: Worker;

function useLineupModel(
  list?: IMinionPropsWithNameAndID[] | Minion[],
  multiWorker?: boolean
) {
  const [minions, setMinions] = React.useState<Minion[]>([]);
  const [finalLineup, setFinalLineup] = React.useState<Minion[]>([]);
  const [combatPower, setCombatPower] = React.useState<number>(0);
  const [loading, { toggle: toggleLoading }] = useBoolean(false);

  const { run: handleMultiWorker } = useDebounceFn(
    (data) => {
      const worker: Worker = new LineupWorker();
      worker.postMessage({ minions: JSON.stringify(data) });
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
    },
    { wait: 200 }
  );

  useDeepCompareEffect(() => {
    if (Array.isArray(list) && list.length) {
      let cloneList = null;
      if ((list as IMinionPropsWithNameAndID[])[0].props) {
        cloneList = cloneDeep(list);
      } else {
        cloneList = cloneDeep(
          (list as Minion[]).map((minion) => ({
            id: minion.id.toString(),
            name: minion.name,
            props: minion,
          }))
        );
      }

      toggleLoading(true);
      if (multiWorker) {
        handleMultiWorker(cloneList);
      } else {
        singleWorker?.terminate();
        singleWorker = new LineupWorker();
        singleWorker.postMessage({ minions: JSON.stringify(cloneList) });
        singleWorker.addEventListener('message', (event) => {
          const _minions: Minion[] = JSON.parse(event.data.minions);
          const _finalLineup: Minion[] = JSON.parse(event.data.finalLineup);
          const _combatPower: number = event.data.combatPower;
          setMinions(_minions);
          setFinalLineup(_finalLineup);
          setCombatPower(_combatPower);
          toggleLoading(false);
          singleWorker.terminate();
        });
        singleWorker.addEventListener('messageerror', () => {
          toggleLoading(false);
          singleWorker.terminate();
        });
      }
    }
  }, [list]);

  return {
    minions,
    finalLineup,
    combatPower,
    loading,
  };
}

export default useLineupModel;
