import { createModel } from 'hox'
import type { RequestMethodsKeys, RequestMethodReturnMap } from './types'

import useObs from './useObs'

function useCommand() {
  const { obs } = useObs()
  async function run<K extends RequestMethodsKeys>(
    command: K,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: any = {}
  ) {
    return ((await obs.send<K>(
      command,
      // @ts-ignore
      params
    )) as unknown) as RequestMethodReturnMap[K]
  }

  return {
    run,
  }
}

export default createModel(useCommand)
