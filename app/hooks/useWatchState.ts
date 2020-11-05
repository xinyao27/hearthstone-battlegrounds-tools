import React from 'react';
import { createModel } from 'hox';
import { useMount } from 'ahooks';
import { ipcRenderer } from 'electron';

import type { WatchState } from '@app/types';
import { LOGHANDLER_MAIN_MESSAGE } from '@app/constants/topic';

function useWatchState(): [
  WatchState,
  React.Dispatch<React.SetStateAction<WatchState>>
] {
  const [watchState, setWatchState] = React.useState<WatchState>({
    state: 'next',
    message: '🚀 正在酒馆中工作',
  });

  useMount(() => {
    ipcRenderer.on(
      LOGHANDLER_MAIN_MESSAGE,
      (
        _event,
        args: {
          type: 'watchState';
          state: 'next' | 'complete' | 'error';
          message: string;
        }
      ) => {
        const { type, state, message } = args;
        if (type === 'watchState') {
          setWatchState({ state, message });
        }
      }
    );
  });

  return [watchState, setWatchState];
}

export default createModel(useWatchState);
