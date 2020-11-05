import React from 'react';
import { useDebounceFn } from 'ahooks';
import dayjs from 'dayjs';

import { records } from '@app/store';
import useConnect from '@app/pages/settings/OBS/useConnect';
import useCommand from '@app/pages/settings/OBS/useCommand';
import useObsText from '@app/pages/settings/OBS/useObsText';

import type { RecordItem } from './useStatistics';

function useRecord(
  callback?: (result: RecordItem[]) => void
): [
  RecordItem[],
  {
    addRecord: (item: RecordItem) => void;
    deleteRecord: (item: RecordItem) => void;
  }
] {
  const { connected } = useConnect();
  const { run } = useCommand();
  const { enable: textEnable, currentSource } = useObsText();
  const [recordList, setRecordList] = React.useState<RecordItem[]>(() =>
    records.get()
  );
  const handleCallback = React.useCallback(
    (result: RecordItem[]) => {
      callback?.(result);

      if (connected) {
        // 只取当天的数据
        const today = dayjs();
        const todayResult = result.filter((v) =>
          dayjs(v.date).isSame(today, 'day')
        );
        if (textEnable) {
          const text = todayResult
            .map((v) => `${v.hero.name} ${v.rank}`)
            .join('\n');
          run('SetTextGDIPlusProperties', {
            source: currentSource,
            text,
          });
        }
      }
    },
    [callback, connected, currentSource, run, textEnable]
  );
  const { run: handleAddRecord } = useDebounceFn(
    (item: RecordItem) => {
      setRecordList((previousState) => {
        const result = [item, ...previousState];
        records.set(result);
        handleCallback(result);
        return result;
      });
    },
    {
      wait: 500,
    }
  );
  const handleDeleteRecord = React.useCallback(
    (item: RecordItem) => {
      setRecordList((previousState) => {
        const result = previousState.filter((v) => v.id !== item.id);
        records.set(result);
        handleCallback(result);
        return result;
      });
    },
    [handleCallback]
  );

  return [
    recordList,
    { addRecord: handleAddRecord, deleteRecord: handleDeleteRecord },
  ];
}

export default useRecord;
