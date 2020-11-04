import React from 'react';
import { useDebounceFn } from 'ahooks';

import { records } from '@app/store';

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
  const [recordList, setRecordList] = React.useState<RecordItem[]>(() =>
    records.get()
  );
  const { run: handleAddRecord } = useDebounceFn(
    (item: RecordItem) => {
      setRecordList((previousState) => {
        const result = [item, ...previousState];
        records.set(result);
        callback?.(result);
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
        callback?.(result);
        return result;
      });
    },
    [callback]
  );

  return [
    recordList,
    { addRecord: handleAddRecord, deleteRecord: handleDeleteRecord },
  ];
}

export default useRecord;
