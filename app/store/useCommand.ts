import { createModel } from 'hox';

import useObs from './useObs';
import type { RequestMethodsKeys, RequestMethodReturnMap } from '../types';

function useCommand() {
  const { obs } = useObs();
  async function run<K extends RequestMethodsKeys>(
    command: K,
    params: any = {}
  ) {
    return ((await obs.send<K>(
      command,
      // @ts-ignore
      params
    )) as unknown) as RequestMethodReturnMap[K];
  }

  return {
    run,
  };
}

export default createModel(useCommand);
