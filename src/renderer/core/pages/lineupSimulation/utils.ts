import type { DraggableLocation } from 'react-beautiful-dnd';
import { Minion } from '@hbt-org/core';

export const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export function move(
  source: Minion[],
  destination: Minion[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) {
  // 从商店向下拖入 - 购买随从
  if (
    droppableSource.droppableId === 'store' &&
    droppableDestination.droppableId === 'minions'
  ) {
    if (destination.length < 7) {
      const sourceClone = Array.from(source);
      const destClone = Array.from(destination);
      const target = sourceClone[droppableSource.index];
      const cloneMinion = Minion.create(
        Math.floor(Math.random() * 10000),
        target.name,
        // @ts-ignore
        target
      );

      destClone.splice(droppableDestination.index, 0, cloneMinion);

      return {
        store: sourceClone,
        minions: destClone,
      };
    }
  }

  // 从阵容向上拖入 - 卖出随从
  if (
    droppableSource.droppableId === 'minions' &&
    droppableDestination.droppableId === 'store'
  ) {
    const sourceClone = Array.from(source);
    sourceClone.splice(droppableSource.index, 1);
    return {
      minions: sourceClone,
      store: destination,
    };
  }

  return null;
}
