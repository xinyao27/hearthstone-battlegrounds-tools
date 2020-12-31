import React from 'react';
import { createModel } from 'hox';
import { is } from 'electron-util';
import _ from 'lodash';

import type { LogData } from '@shared/types';
import type { State } from '@logHandler/features';
import type { OpponentLineup } from '@suspension/types';

export type StateFlow = Record<State, LogData> & {
  current: State;
};

function useStateFlow(): [
  StateFlow | null,
  (value: LogData<State>) => void,
  () => void
] {
  const [state, setState] = React.useState<StateFlow | null>(null);
  const handleState = React.useCallback((baseValue: LogData<State>) => {
    const value = _.cloneDeep(baseValue);
    // @ts-ignore
    setState((prevState) => {
      switch (value.state) {
        case 'GAME_START':
          return {
            ...prevState,
            [value.state]: value,
            current: value.state,
          };
        case 'HERO_TOBE_CHOSEN':
          return {
            ...prevState,
            [value.state]: value,
            current: value.state,
          };
        case 'OPPONENT_HEROES':
          return {
            ...prevState,
            [value.state]: {
              ...value,
              result: _.uniqWith(
                [
                  ...(prevState?.OPPONENT_HEROES?.result ?? []),
                  ...(value?.result ?? []),
                ],
                _.isEqual
              ),
            },
            current: value.state,
          };
        case 'ALANNA_TRANSFORMATION':
          // eslint-disable-next-line no-case-declarations
          const { oldHero, hero: newHero, id: newId } = value?.result;
          // eslint-disable-next-line no-case-declarations
          const OLD_OPPONENT_HEROES = prevState?.OPPONENT_HEROES?.result;
          // eslint-disable-next-line no-case-declarations
          const NEW_OPPONENT_HEROES = OLD_OPPONENT_HEROES?.map(
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
          if (prevState?.NEXT_OPPONENT?.result?.hero === newHero) {
            const NEXT_OPPONENT = {
              ...prevState?.NEXT_OPPONENT,
              result: {
                ...prevState?.NEXT_OPPONENT?.result,
                id: newId,
                hero: newHero,
              },
            };
            return {
              ...prevState,
              OPPONENT_HEROES: {
                ...prevState?.OPPONENT_HEROES,
                result: NEW_OPPONENT_HEROES,
              },
              NEXT_OPPONENT,
              [value.state]: value,
              current: value.state,
            };
          }
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
        case 'LINEUP':
          if (
            value?.result &&
            value.result.opponent?.hero &&
            value.result.own?.minions
          ) {
            const {
              hero: opponentHero,
              minions: opponentMinions,
            } = value.result.opponent;
            const { minions: ownMinions } = value.result.own;

            // 加入当场的回合数，回溯用
            const turn = prevState?.TURN?.result;

            const prev: OpponentLineup[] = prevState?.LINEUP?.result.opponent;
            if (prev?.length) {
              const target = prev.find((v) => v.hero === opponentHero);
              if (target) {
                const opponent = prev.map((v) => {
                  if (v.hero === opponentHero) {
                    return {
                      ...v,
                      minions: opponentMinions,
                      turn,
                    };
                  }
                  return v;
                });
                value.result = {
                  opponent,
                  own: {
                    turn,
                    minions: ownMinions,
                  },
                };
                return {
                  ...prevState,
                  [value.state]: value,
                  current: value.state,
                };
              }
              const opponent = [...prev, { ...value.result.opponent, turn }];
              value.result = {
                opponent,
                own: {
                  turn,
                  minions: ownMinions,
                },
              };
              return {
                ...prevState,
                [value.state]: value,
                current: value.state,
              };
            }

            value.result = {
              opponent: [{ ...value.result.opponent, turn }],
              own: {
                turn,
                minions: ownMinions,
              },
            };
            return {
              ...prevState,
              [value.state]: value,
              current: value.state,
            };
          }
          return prevState;
        // case 'LINEUP2':
        //   if (
        //     value?.result &&
        //     Array.isArray(value.result) &&
        //     value.result.length
        //   ) {
        //     if (prevState && prevState.LINEUP) {
        //       prevState.LINEUP.result.own.minions = value.result;
        //     }
        //     return {
        //       ...prevState,
        //       LINEUP: prevState?.LINEUP,
        //       [value.state]: value,
        //       current: value.state,
        //     };
        //   }
        //   return prevState;
        default:
          return {
            ...prevState,
            [value.state]: value,
            current: value.state,
          };
      }
    });
  }, []);
  const resetState = React.useCallback(() => {
    setState(null);
  }, []);

  if (is.development) {
    // eslint-disable-next-line no-console
    console.log(state);
  }

  return [state, handleState, resetState];
}

export default createModel(useStateFlow);
