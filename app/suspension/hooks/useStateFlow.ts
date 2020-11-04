import React from 'react';
import { createModel } from 'hox';

import type { State } from '@logHandler/regex';
import type { Filtered } from '@logHandler/parser';

export type StateFlow = Record<
  State,
  {
    date: Filtered['date'];
    result: Filtered['result'];
    line: Filtered['line'];
  }
> & {
  current: State;
};

function useStateFlow(): [StateFlow | null, (value: Filtered) => void] {
  const [state, setState] = React.useState<StateFlow | null>(null);
  const handleState = React.useCallback((value: Filtered) => {
    // @ts-ignore
    setState((prevState) => {
      const data = {
        date: value.date,
        result: value.result,
        line: value.line,
      };
      switch (value.state) {
        case 'GAME_START':
          return {
            [value.state]: data,
            current: value.state,
          };
        case 'HERO_TOBE_CHOSEN':
          return {
            ...prevState,
            [value.state]: prevState?.HERO_TOBE_CHOSEN
              ? {
                  ...prevState.HERO_TOBE_CHOSEN,
                  result: [
                    ...new Set([
                      ...prevState.HERO_TOBE_CHOSEN.result,
                      value.result,
                    ]),
                  ],
                }
              : {
                  ...data,
                  result: [data.result],
                },
            current: value.state,
          };
        default:
          return {
            ...prevState,
            [value.state]: data,
            current: value.state,
          };
      }
    });
  }, []);

  return [state, handleState];
}

export default createModel(useStateFlow);
