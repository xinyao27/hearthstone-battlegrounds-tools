import { createModel } from "hox"
import { useLocalStorageState } from "ahooks"

import heros from "../heros"

function useStatistics() {
  const [list] = useLocalStorageState("record-list", [])

  const reSummarized = list.reduce((pre, cur) => {
    const key = cur.hero.id
    const preRanks = pre[key]
    const newRanks = [...(preRanks || []), { rank: cur.rank, date: cur.date }]
    return {
      ...pre,
      [key]: newRanks,
    }
  }, {})
  const resultUnsorted = {}
  for (const id in reSummarized) {
    const ranks = reSummarized[id]
    const hero = heros.find(v => v.id === parseInt(id, 10))
    const avatar = hero ? hero.battlegrounds.image : ""
    const name = hero ? hero.name : ""
    const averageRanking = (
      ranks.reduce((pre, cur) => pre + parseInt(cur.rank, 10), 0) / ranks.length
    ).toFixed(2)
    const selectRate = ranks.length / list.length
    resultUnsorted[id] = {
      name,
      avatar,
      averageRanking,
      selectRate,
    }
  }

  const result = Object.keys(resultUnsorted)
    .map(key => {
      const value = resultUnsorted[key]
      return {
        ...value,
        id: parseInt(key, 10),
        ranks: reSummarized[key],
      }
    })
    .sort((a, b) => a.averageRanking - b.averageRanking)

  return {
    list,
    reSummarized,
    resultUnsorted,
    result,
  }
}

export default createModel(useStatistics)
