import log from 'electron-log'

import { Topic } from '@shared/constants/topic'
import { getStore } from '@shared/store'
import type { LogData } from '@shared/types'

import type { MatchResult } from './utils'

const store = getStore()

/**
 * 负责将整理过的日志信息向外广播
 * @param type
 * @param source
 */
export function logManager(
  type: 'box' | 'state',
  source: MatchResult[] | null
) {
  if (source && source.length) {
    source.forEach((item) => {
      const result = item.feature?.getResult?.(item.line)
      const data: LogData = {
        type,
        date: item.date,
        state: item.state,
        original: item.line?.original,
        result,
      }
      log.info(data)
      store.dispatch<Topic.FLOW>({
        type: Topic.FLOW,
        payload: data,
      })
    })
  }
}
