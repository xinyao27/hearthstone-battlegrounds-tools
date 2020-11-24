import React from 'react';
import { createModel } from 'hox';
import { is } from 'electron-util';

import type { State } from '@logHandler/features';
import { stateFeatures } from '@logHandler/features';
import type { MatchResult } from '@logHandler/utils';
import type { OpponentLineup } from '@suspension/types';

export type StateFlow = Record<
  State,
  {
    date: MatchResult<State>['date'];
    line: MatchResult<State>['line'];
    feature: MatchResult<State>['feature'];
    result: any;
  }
> & {
  current: State;
};

function getStateFeature(state: State) {
  return stateFeatures.find((v) => v.state === state);
}

function useStateFlow(): [
  StateFlow | null,
  (value: MatchResult<State>) => void
] {
  const [state, setState] = React.useState<StateFlow | null>(null);
  const handleState = React.useCallback((value: MatchResult<State>) => {
    // @ts-ignore
    setState((prevState) => {
      const feature = getStateFeature(value.state);
      const data = {
        date: value.date,
        line: value.line,
        feature,
        result: feature?.getResult?.(value.line),
      };
      switch (value.state) {
        case 'GAME_START':
          return {
            [value.state]: data,
            current: value.state,
          };
        case 'OPPONENT_HEROES':
          return {
            ...prevState,
            [value.state]: {
              ...data,
              result: [
                ...new Set([
                  ...(prevState?.OPPONENT_HEROES?.result ?? []),
                  ...(data?.result ?? []),
                ]),
              ],
            },
            current: value.state,
          };
        case 'NEXT_OPPONENT':
          if (data?.result && prevState?.OPPONENT_HEROES?.result?.length) {
            // 通常 NEXT_OPPONENT 的 result 为下一场对战英雄的 id。这里根据 id 查到对应英雄
            data.result = prevState?.OPPONENT_HEROES.result.find(
              (v: { hero: string; playerId: string }) =>
                v.playerId === data.result
            );
            return {
              ...prevState,
              [value.state]: data,
              current: value.state,
            };
          }
          return prevState;
        case 'OPPONENT_LINEUP':
          if (data?.result && data.result.hero) {
            const { hero, minions } = data.result;
            // 加入当场的回合数，回溯用
            const turn = prevState?.TURN?.result;
            data.result.turn = turn;
            const prev: OpponentLineup[] = prevState?.OPPONENT_LINEUP?.result;
            if (prev?.length) {
              const target = prev.find((v) => v.hero === hero);
              if (target) {
                data.result = prev.map((v) => {
                  if (v.hero === hero) {
                    return {
                      ...v,
                      minions,
                      turn,
                    };
                  }
                  return v;
                });
                return {
                  ...prevState,
                  [value.state]: data,
                  current: value.state,
                };
              }
              data.result = [...prev, data.result];
              return {
                ...prevState,
                [value.state]: data,
                current: value.state,
              };
            }
            data.result = [data.result];
            return {
              ...prevState,
              [value.state]: data,
              current: value.state,
            };
          }
          return prevState;
        default:
          return {
            ...prevState,
            [value.state]: data,
            current: value.state,
          };
      }
    });
  }, []);

  if (is.development) {
    // eslint-disable-next-line no-console
    console.log(state);
  }

  return [state, handleState];
}

export default createModel(useStateFlow);
