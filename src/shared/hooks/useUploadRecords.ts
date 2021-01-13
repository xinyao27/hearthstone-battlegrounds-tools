import React from 'react';
import { useRequest, useUpdateEffect } from 'ahooks';
import { createModel } from 'hox';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { chunk } from 'lodash';

import { records } from '@shared/db';
import type { RecordItem } from '@core/hooks/useStatistics';

import useAuth from './useAuth';
import { uploadRecords } from '../api';

dayjs.extend(isBetween);

const TIME = 30 * 60 * 1000;

function useUploadRecords() {
  const { hasAuth } = useAuth();
  const { loading, run, cancel } = useRequest(uploadRecords, {
    manual: true,
    pollingInterval: TIME,
  });

  const handleUpload = React.useCallback(
    async (data: RecordItem[]) => {
      const result = await run(data);
      if (result) {
        // eslint-disable-next-line no-restricted-syntax
        for (const item of data) {
          // eslint-disable-next-line no-await-in-loop
          await records.setUploaded(item, true);
        }
      }
    },
    [run]
  );

  useUpdateEffect(() => {
    (async () => {
      if (hasAuth) {
        const now = dayjs();
        const previous = now.subtract(3, 'month');
        const data = await records.find({
          $where() {
            // 筛选出近三个月内且没有上传过的数据
            return (
              dayjs(this.date).isBetween(now, previous, null, '[]') &&
              !this.uploaded
            );
          },
        });
        if (data.length > 0) {
          const max = 100;
          const chunkData = chunk(data, max);
          // eslint-disable-next-line no-restricted-syntax
          for (const c of chunkData) {
            // eslint-disable-next-line no-await-in-loop
            await handleUpload(c);
          }
        }
      } else {
        cancel();
      }
    })();
  }, [hasAuth]);

  return {
    loading,
  };
}

export default createModel(useUploadRecords);
