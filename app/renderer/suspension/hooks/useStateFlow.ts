import React from 'react';
import { createModel } from 'hox';

import type { State } from '@logHandler/features';
import type { MatchResult } from '@logHandler/utils';
import { stateFeatures } from '@logHandler/features';

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
