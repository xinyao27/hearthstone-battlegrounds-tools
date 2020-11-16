import React from 'react';
import { createModel } from 'hox';

import type { BoxState } from '@logHandler/features';
import type { Filtered } from '@logHandler/parser';

export type BoxFlow = Record<
  BoxState,
  {
    date: Filtered['date'];
    result: Filtered['result'];
    block: Filtered['block'];
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
        block: value.block,
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
