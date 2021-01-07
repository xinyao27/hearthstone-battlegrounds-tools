/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Minion, minions as allMinions } from '@hbt-org/core';
import { useDebounceFn } from 'ahooks';

import Text from '@suspension/components/Text';
import useLineupModel from '@shared/hooks/useLineupModel';

import { reorder, move } from './utils';
import Search, { SearchValue } from './Search';
import Store from './Store';
import Minions from './Minions';

const useStyles = makeStyles((theme) => ({
  root: {},
  combatPower: {
    height: 36,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    fontSize: 24,
  },
  board: {
    minHeight: 300,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeContainer: {
    overflowX: 'auto',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

const defaultStoreMinions = allMinions.map((v) =>
  Minion.create(v.id, v.name, {
    ...v,
    // @ts-ignore
    BACON_MINION_IS_LEVEL_TWO: !v.battlegroundsPremiumDbfId,
  })
);

const Checkerboard: React.FC = () => {
  const classes = useStyles();
  const [minions, setMinions] = React.useState<Minion[]>([]);
  const [storeMinions, setStoreMinions] = React.useState<Minion[]>(
    () => defaultStoreMinions
  );

  const { combatPower, loading: combatPowerLoading } = useLineupModel(
    minions,
    false
  );

  const getList = React.useCallback(
    (id: string) => {
      if (id === 'store') return storeMinions;
      if (id === 'minions') return minions;
      return storeMinions;
    },
    [minions, storeMinions]
  );

  const handleDragEnd = React.useCallback(
    (value: DropResult) => {
      const { source, destination } = value;

      if (!destination) {
        return;
      }

      // 如果拖动的目标和结束的目标在同一个区域（非跨区域移动）
      if (source.droppableId === destination.droppableId) {
        if (source.index === destination.index) {
          return;
        }
        // 返回拖动后变化的数组
        const items = reorder(
          getList(source.droppableId),
          source.index,
          destination.index
        );

        if (source.droppableId === 'store') {
          setStoreMinions(items);
        }
        if (source.droppableId === 'minions') {
          setMinions(items);
        }
      } else {
        // 跨区域移动
        const result = move(
          getList(source.droppableId),
          getList(destination.droppableId),
          source,
          destination
        );

        if (result) {
          setStoreMinions(result.store);
          setMinions(result.minions);
        }
      }
    },
    [getList]
  );

  const { run } = useDebounceFn(
    (value: SearchValue) => {
      setStoreMinions(() => {
        const { query, techLevel, race } = value;
        const result = defaultStoreMinions.filter((minion) => {
          const matchQuery =
            minion.name.includes(query!) ||
            minion.text.includes(query!) ||
            query === '';
          const matchTier = minion.techLevel === techLevel || techLevel === 0;
          const matchRace = minion.race === race || race === -1;

          return matchQuery && matchTier && matchRace;
        });

        return result;
      });
    },
    { wait: 300 }
  );

  return (
    <div className={classes.root}>
      <Search onChange={run} />

      <div className={classes.combatPower}>
        <Text>当前战力：</Text>
        {combatPowerLoading ? <CircularProgress /> : <Text>{combatPower}</Text>}
      </div>

      <div className={classes.board}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Store data={storeMinions} />
          <Minions data={minions} onChange={setMinions} />
        </DragDropContext>
      </div>
    </div>
  );
};

export default Checkerboard;
