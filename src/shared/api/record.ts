import type { RecordItem } from '@core/hooks/useStatistics';

import request from './request';

export async function uploadRecords(records: RecordItem[]): Promise<boolean> {
  const url = `/records`;
  const { data } = await request.post(url, { data: records });
  return !!(data && data.code === 0);
}
