import type { IMinionPropsWithNameAndID } from '@hbt-org/core'

import useHeroes from '@shared/hooks/useHeroes'
import { getImageUrl } from '@suspension/utils'

export interface RecordItem {
  _id: string
  hero: {
    id: number
    name: string
  }
  rank: string
  date: string | Date
  remark?: string
  lineup?: {
    turn: number
    minions: IMinionPropsWithNameAndID[]
  }
  history?: {
    attack: number
    attacker: string
    defender: string
    lineup: {
      opponent: IMinionPropsWithNameAndID[]
      own: IMinionPropsWithNameAndID[]
    }
    turn: number
  }[]
  synced?: boolean
}
export interface ResultItem {
  heroId: number
  heroAvatar: string
  heroName: string
  ranks: {
    rank: string
    date: string
  }[]
  averageRanking: number
  selectRate: number
}

function useStatistics(recordList: RecordItem[]): ResultItem[] | null {
  const { heroes } = useHeroes()
  if (recordList && recordList.length) {
    const reSummarized = recordList.reduce<{
      [key: number]: {
        rank: string
        date: string | Date
      }[]
    }>((pre, cur) => {
      const key = cur.hero.id
      const preRanks = pre[key]
      const newRanks = [...(preRanks || []), { rank: cur.rank, date: cur.date }]
      return {
        ...pre,
        [key]: newRanks,
      }
    }, {})

    return Object.keys(reSummarized)
      .reduce<ResultItem[]>((pre, cur) => {
        const heroId = parseInt(cur, 10)
        const hero = heroes.find((v) => v.dbfId === heroId)
        const heroAvatar = hero ? getImageUrl(hero.id, 'hero') : ''
        const heroName = hero ? hero.name : ''
        const ranks = reSummarized[heroId]

        if (ranks) {
          const averageRanking = (
            ranks.reduce((acc, _cur) => acc + parseInt(_cur.rank, 10), 0) /
            ranks.length
          ).toFixed(2)
          const selectRate = ranks.length / recordList.length

          const currentItem = {
            heroId,
            heroAvatar,
            heroName,
            ranks,
            averageRanking,
            selectRate,
          }
          return [...pre, currentItem] as ResultItem[]
        }
        return pre
      }, [])
      .sort((a, b) => a.averageRanking - b.averageRanking)
  }
  return null
}

export default useStatistics
