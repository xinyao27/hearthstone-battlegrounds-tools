import React from 'react';
import { createModel } from 'hox';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { usePrevious } from 'ahooks';

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
  const [opponentLineup, setOpponentLineup] = React.useState<{
    opponent: OpponentLineup[];
    own: {
      turn: string;
      minions: OpponentLineup['minions'];
    };
  }>();
  // 当前对手的阵容（显示）
  const currentOpponentLineup = opponentLineup?.opponent?.find(
    (v: { hero: string }) => v.hero === currentOpponent?.hero
  );
  // 上一个对手（显示）
  const previousOpponent = usePrevious(currentOpponent, (prev, next) => {
    if (!prev && next) return true;
    return prev?.hero !== next?.hero && prev?.playerId !== next?.playerId;
  });
  // 上一个对手的阵容（显示）
  const previousOpponentLineup = opponentLineup?.opponent?.find(
    (v: { hero: string }) => v.hero === previousOpponent?.hero
  );
  // 所有对手的英雄（不显示）
  const opponentHeroes = stateFlow?.OPPONENT_HEROES?.result;
  // 所有对手的阵容（显示）
  const allOpponentLineup: OpponentLineup[] = opponentHeroes?.map(
    (v: { hero: string }) => {
      const result = opponentLineup?.opponent?.find(
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
      setOpponentLineup(stateFlow?.LINEUP?.result);
    }
  }, [stateFlow || {}]);

  return {
    currentTurn,
    currentOpponent,
    currentOpponentLineup,
    previousOpponent,
    previousOpponentLineup,
    allOpponentLineup,
  };
}

export default createModel(useBattleState);
