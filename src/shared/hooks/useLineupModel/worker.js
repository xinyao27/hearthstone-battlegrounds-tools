import { Lineup } from '@hbt-org/core'

self.addEventListener('message', (event) => {
  const minions = JSON.parse(event.data.minions)
  const lineup = Lineup.create(minions).minions
  Lineup.getAllPossibleLineups(lineup)
    .then((finalLineup) => {
      const combatPower = finalLineup.reduce(
        (acc, cur) => acc + cur.COMBAT_POWER,
        0
      )
      return self.postMessage({
        minions: JSON.stringify(lineup),
        finalLineup: JSON.stringify(finalLineup),
        combatPower,
      })
    })
    .catch((e) => {
      throw e
    })
  self.setTimeout(() => {
    throw new Error('计算超时')
  }, 10000)
})
