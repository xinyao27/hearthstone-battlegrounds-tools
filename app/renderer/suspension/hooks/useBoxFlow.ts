import React from 'react';
import { createModel } from 'hox';

import type { BoxState } from '@logHandler/features';
import type { MatchResult } from '@logHandler/utils';

export type BoxFlow = Record<
  BoxState,
  {
    date: MatchResult<BoxState>['date'];
    line: MatchResult<BoxState>['line'];
    feature: MatchResult<BoxState>['feature'];
    result: any;
  }
> & {
  current: BoxState;
};

function useBoxFlow(): [
  BoxFlow | null,
  (value: MatchResult<BoxState>) => void
] {
  // @ts-ignore
  const [box, setBox] = React.useState<BoxFlow>({});
  const handleBox = React.useCallback((value: MatchResult<BoxState>) => {
    // @ts-ignore
    setBox((prevState) => {
      const data = {
        date: value.date,
        line: value.line,
        feature: value.feature,
      };
      return {
        ...prevState,
        [value.state]: data,
        current: value.state,
      };
    });
  }, []);

  return [box, handleBox];
}

export default createModel(useBoxFlow);
