import React from 'react';
import { useLocalStorageState, useDebounceFn } from 'ahooks';
import type { RecordItem } from './useStatistics';

function useNewRecord(
  callback?: (result: RecordItem[]) => void
): [
  RecordItem[],
  {
    addRecord: (item: RecordItem) => void;
    deleteRecord: (item: RecordItem) => void;
  }
] {
  const [recordList, setRecordList] = useLocalStorageState<RecordItem[]>(
    'record-list',
    []
  );

  const { run: handleAddRecord } = useDebounceFn(
    (item: RecordItem) => {
      setRecordList((previousState) => {
        const result = [item, ...previousState];
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

export default useNewRecord;
