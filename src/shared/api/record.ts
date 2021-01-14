import type { RecordItem } from '@shared/hooks/useStatistics';

import request from './request';

export async function uploadRecords(records: RecordItem[]): Promise<boolean> {
  const url = `/records`;
  const { data } = await request.post(url, { data: records });
  return !!(data && data.code === 0);
}

export async function synchronousRecords(collection: string[]) {
  const url = `/records`;
  const { data } = await request.put(url, { collection });
  if (data.code === 0 && data.data) {
    return data.data;
  }
  return null;
}
