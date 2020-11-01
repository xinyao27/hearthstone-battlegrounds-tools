import { useRequest } from 'ahooks';
import { ajax } from 'rxjs/ajax';
import { createModel } from 'hox';

export interface ListHeroesResult {
  render_as: string;
  series: {
    data: {
      hero_dbf_id: number;
      num_games_played: number;
      pick_rate: number;
      popularity: number;
      times_offered: number;
      times_chosen: number;
      avg_final_placement: number;
      final_placement_distribution: number[];
      confidence_interval: number;
    }[];
    metadata: Record<string, unknown>;
  };
  as_of: string;
}

async function getHeroes(): Promise<ListHeroesResult> {
  return ajax
    .getJSON<ListHeroesResult>(
      `https://hsreplay.net/analytics/query/battlegrounds_list_heroes/?BattlegroundsMMRPercentile=ALL&BattlegroundsTimeRange=LAST_7_DAYS`
    )
    .toPromise<ListHeroesResult>();
}

function useListHeroes() {
  return useRequest(getHeroes, { cacheKey: 'heroes' });
}

export default createModel(useListHeroes);
