import React from 'react';
import { createModel } from 'hox';
import { is } from 'electron-util';

import type { LogData } from '@shared/types';
import type { State } from '@logHandler/features';
import type { OpponentLineup } from '@suspension/types';

export type StateFlow = Record<State, LogData> & {
  current: State;
};

function useStateFlow(): [StateFlow | null, (value: LogData<State>) => void] {
  const [state, setState] = React.useState<StateFlow | null>(null);
  const handleState = React.useCallback((value: LogData<State>) => {
    // @ts-ignore
    setState((prevState) => {
      switch (value.state) {
        case 'GAME_START':
          return {
            [value.state]: value,
            current: value.state,
          };
        case 'HERO_TOBE_CHOSEN':
          return {
            [value.state]: value,
            current: value.state,
          };
        case 'OPPONENT_HEROES':
          return {
            ...prevState,
            [value.state]: {
              ...value,
              result: [
                ...new Set([
                  ...(prevState?.OPPONENT_HEROES?.result ?? []),
                  ...(value?.result ?? []),
                ]),
              ],
            },
            current: value.state,
          };
        case 'ALANNA_TRANSFORMATION':
          // eslint-disable-next-line no-case-declarations
          const { oldHero, hero: newHero, id: newId } = value?.result;
          // eslint-disable-next-line no-case-declarations
          const OLD_OPPONENT_HEROES = prevState?.OPPONENT_HEROES?.result;
          // eslint-disable-next-line no-case-declarations
          const NEW_OPPONENT_HEROES = OLD_OPPONENT_HEROES.map(
            (v: { id: any; hero: any }) => {
              if (v.hero === oldHero) {
                return {
                  ...v,
                  hero: newHero,
                  id: newId,
                };
              }
              return v;
            }
          );
          return {
            ...prevState,
            OPPONENT_HEROES: {
              ...prevState?.OPPONENT_HEROES,
              result: NEW_OPPONENT_HEROES,
            },
            [value.state]: value,
            current: value.state,
          };
        case 'NEXT_OPPONENT':
          if (value?.result && prevState?.OPPONENT_HEROES?.result?.length) {
            // 通常 NEXT_OPPONENT 的 result 为下一场对战英雄的 id。这里根据 id 查到对应英雄
            value.result = prevState?.OPPONENT_HEROES.result.find(
              (v: { hero: string; playerId: string }) =>
                v.playerId === value.result
            );
            return {
              ...prevState,
              [value.state]: value,
              current: value.state,
            };
          }
          return prevState;
        case 'OPPONENT_LINEUP':
          if (value?.result && value.result.hero) {
            const { hero, minions } = value.result;
            // 加入当场的回合数，回溯用
            const turn = prevState?.TURN?.result;
            value.result.turn = turn;
            const prev: OpponentLineup[] = prevState?.OPPONENT_LINEUP?.result;
            if (prev?.length) {
              const target = prev.find((v) => v.hero === hero);
              if (target) {
                value.result = prev.map((v) => {
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
                  [value.state]: value,
                  current: value.state,
                };
              }
              value.result = [...prev, value.result];
              return {
                ...prevState,
                [value.state]: value,
                current: value.state,
              };
            }
            value.result = [value.result];
            return {
              ...prevState,
              [value.state]: value,
              current: value.state,
            };
          }
          return prevState;
        default:
          return {
            ...prevState,
            [value.state]: value,
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
