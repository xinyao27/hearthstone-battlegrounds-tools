import React from 'react';
import { createModel } from 'hox';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { usePrevious, useSet } from 'ahooks';

import type { OpponentLineup } from '@suspension/types';

import useStateFlow from './useStateFlow';

function useBattleState() {
  const [stateFlow] = useStateFlow();
  // 当前回合数（显示）
  const [currentTurn, setCurrentTurn] = React.useState<number>();
  // 当前的对手（显示）
  const [currentOpponent, setCurrentOpponent] = React.useState<{
    hero: string;
    playerId: string;
  }>();
  // 所有对手的阵容（不显示）
  const [allLineup, setAllLineup] = React.useState<{
    opponent: OpponentLineup[];
    own: {
      turn: string;
      minions: OpponentLineup['minions'];
    };
  }>();
  const [history, { add: addHistory, reset: resetHistory }] = useSet([]);
  // 自己的阵容（显示）
  const ownLineup = allLineup?.own?.minions ?? [];
  // 当前对手的阵容（显示）
  const currentOpponentLineup = allLineup?.opponent?.find(
    (v: { hero: string }) => v.hero === currentOpponent?.hero
  );
  // 上一个对手（显示）
  const previousOpponent = usePrevious(currentOpponent, (prev, next) => {
    if (!prev && next) return true;
    return prev?.hero !== next?.hero && prev?.playerId !== next?.playerId;
  });
  // 上一个对手的阵容（显示）
  const previousOpponentLineup = allLineup?.opponent?.find(
    (v: { hero: string }) => v.hero === previousOpponent?.hero
  );
  // 所有对手的英雄（不显示）
  const opponentHeroes = stateFlow?.OPPONENT_HEROES?.result;
  // 所有对手的阵容（显示）
  const allOpponentLineup: OpponentLineup[] = opponentHeroes?.map(
    (v: { hero: string }) => {
      const result = allLineup?.opponent?.find(
        (l: { hero: string }) => l.hero === v.hero
      );
      return {
        hero: v?.hero,
        turn: result?.turn,
        minions: result?.minions,
      };
    }
  );

  useDeepCompareEffect(() => {
    const turn = parseInt(stateFlow?.TURN?.result, 10);
    const backToShop = stateFlow?.current === 'BACK_TO_SHOP';
    if (turn > 1) {
      if (backToShop) {
        setCurrentTurn(turn);
        setCurrentOpponent(stateFlow?.NEXT_OPPONENT?.result);
      }
    } else {
      setCurrentTurn(turn);
      setCurrentOpponent(stateFlow?.NEXT_OPPONENT?.result);
    }

    if (stateFlow?.current === 'LINEUP') {
      setAllLineup(stateFlow?.LINEUP?.result);
    }
    if (stateFlow?.current === 'DAMAGE') {
      const item = stateFlow?.DAMAGE?.result?.find(
        (v: { turn: number | undefined }) => v.turn === currentTurn
      );
      const lineup = {
        own: ownLineup,
        opponent: currentOpponentLineup?.minions,
      };
      addHistory({
        ...item,
        // @ts-ignore
        lineup,
      });
    }
  }, [stateFlow || {}]);

  return {
    currentTurn,
    currentOpponent,
    ownLineup,
    currentOpponentLineup,
    previousOpponent,
    previousOpponentLineup,
    allOpponentLineup,
    history,
    resetHistory,
  };
}

export default createModel(useBattleState);
