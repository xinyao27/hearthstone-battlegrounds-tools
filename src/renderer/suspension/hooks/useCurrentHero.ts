import React from 'react'
import { createModel } from 'hox'
import useDeepCompareEffect from 'use-deep-compare-effect'
import type { IHero } from '@hbt-org/core'
import { cloneDeep } from 'lodash'
import { useDebounceFn, useUpdateEffect } from 'ahooks'

import { getStore } from '@shared/store'
import useHeroes from '@shared/hooks/useHeroes'
import { Topic } from '@shared/constants/topic'
import useStateFlow from '@suspension/hooks/useStateFlow'
import useBoxFlow from '@suspension/hooks/useBoxFlow'
import useUnplug from '@suspension/hooks/useUnplug'
import useBattleState from '@suspension/hooks/useBattleState'

const store = getStore()

function useCurrentHero() {
  const [stateFlow, , resetState] = useStateFlow()
  const [boxFlow] = useBoxFlow()
  const { getHeroId, getHero } = useHeroes()
  const { completed: unplugCompleted } = useUnplug()
  const { history, resetHistory } = useBattleState()
  const [hero, setHero] = React.useState<IHero | null>(null)
  const [rank, setRank] = React.useState<string>('8')

  const handleReset = React.useCallback(() => {
    setHero(null)
    setRank('8')
    resetState()
    resetHistory()
  }, [resetHistory, resetState])

  useDeepCompareEffect(() => {
    if (stateFlow?.HERO_CHOICES?.result) {
      const [heroName] = stateFlow.HERO_CHOICES.result
      const heroId = getHeroId(heroName)
      const heroData = getHero(heroId)

      if (heroData) {
        setHero(heroData)
        if (stateFlow.GAME_RANKING?.result) {
          const rankData = stateFlow.GAME_RANKING.result
          setRank(rankData)
        }
      }
    }
  }, [stateFlow || {}, getHeroId, getHero])

  // 战绩发送至 core 添加战绩
  const { run } = useDebounceFn(
    (_hero, _rank, _stateFlow) => {
      if (_hero && _rank) {
        const date = new Date()
        const record = {
          hero: {
            id: _hero.dbfId,
            name: _hero.name,
          },
          rank: _rank,
          date,
          lineup: cloneDeep(_stateFlow?.LINEUP?.result?.own),
          history: cloneDeep(Array.from(history)),
        }
        store.dispatch<Topic.ADD_RECORD>({
          type: Topic.ADD_RECORD,
          payload: record,
        })
        handleReset()
      }
    },
    { wait: 200 }
  )

  useUpdateEffect(() => {
    if (
      boxFlow?.current === 'BOX_GAME_OVER' &&
      // 开启拔线后 10 秒内不记录
      unplugCompleted
    ) {
      run(hero, rank, stateFlow)
    }
  }, [boxFlow?.current])

  return {
    hero,
    rank,
    reset: handleReset,
  }
}

export default createModel(useCurrentHero)
