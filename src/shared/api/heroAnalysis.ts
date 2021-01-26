import { config } from '@shared/store'

import request from './request'

export type ListHeroesResult = {
  hero_dbf_id: number
  num_games_played: number
  pick_rate: number
  popularity: number
  times_offered: number
  times_chosen: number
  avg_final_placement: number
  final_placement_distribution: number[]
  confidence_interval: number
}[]

export async function getHeroAnalysis(): Promise<ListHeroesResult | undefined> {
  const rank = config.get('rank') as string
  const url = `/analysis/heroes?type=${rank}`
  const { data } = await request.get(url)
  if (data && data.code === 0) {
    return data.data
  }
  return undefined
}
