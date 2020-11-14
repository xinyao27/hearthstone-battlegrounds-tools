import React from 'react';
import { createModel } from 'hox';

import type { BoxState } from '@logHandler/regex';
import type { Filtered } from '@logHandler/parser';

export type BoxFlow = Record<
  BoxState,
  {
    date: Filtered['date'];
    result: Filtered['result'];
    line: Filtered['line'];
  }
> & {
  current: BoxState;
};

function useBoxFlow(): [BoxFlow | null, (value: Filtered) => void] {
  // @ts-ignore
  const [box, setBox] = React.useState<BoxFlow>({});
  const handleBox = React.useCallback((value: Filtered) => {
    // @ts-ignore
    setBox((prevState) => {
      const data = {
        date: value.date,
        result: value.result,
        line: value.line,
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
