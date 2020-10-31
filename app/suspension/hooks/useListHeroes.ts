import { useRequest } from 'ahooks';
import { ajax } from 'rxjs/ajax';
import { createModel } from 'hox';

async function getHeroes() {
  return ajax
    .getJSON(
      `https://hsreplay.net/analytics/query/battlegrounds_list_heroes/?BattlegroundsMMRPercentile=ALL&BattlegroundsTimeRange=LAST_7_DAYS`
    )
    .toPromise();
}

function useListHeroes() {
  return useRequest(getHeroes, { cacheKey: 'heroes' });
}

export default createModel(useListHeroes);
