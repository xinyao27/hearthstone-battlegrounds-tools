import type { RecordItem } from '@shared/hooks/useStatistics'

import request, { getAuthConfig } from './request'

export async function uploadRecords(records: RecordItem[]): Promise<boolean> {
  const url = `/records`
  const { data } = await request.post(url, { data: records }, getAuthConfig())
  return !!(data && data.code === 0)
}

export async function synchronousRecords(
  collection: string[]
): Promise<string | null> {
  const url = `/records`
  const { data } = await request.put(url, { collection }, getAuthConfig())
  if (data.code === 0 && data.data) {
    return data.data
  }
  return null
}
