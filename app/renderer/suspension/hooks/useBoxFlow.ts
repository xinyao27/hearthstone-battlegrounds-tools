import React from 'react';
import { createModel } from 'hox';

import type { BoxState } from '@logHandler/features';
import { LogData } from '@shared/types';

export type BoxFlow = Record<BoxState, LogData> & {
  current: BoxState;
};

function useBoxFlow(): [BoxFlow | null, (value: LogData<BoxState>) => void] {
  // @ts-ignore
  const [box, setBox] = React.useState<BoxFlow>({});
  const handleBox = React.useCallback((value: LogData<BoxState>) => {
    setBox((prevState) => {
      return {
        ...prevState,
        [value.state]: value,
        current: value.state,
      };
    });
  }, []);

  return [box, handleBox];
}

export default createModel(useBoxFlow);
