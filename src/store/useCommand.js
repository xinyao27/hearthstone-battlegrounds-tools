import { createModel } from "hox"

import useObs from "./useObs"

function useCommand() {
  const { obs } = useObs()

  return {
    run: async (command, params = {}) => obs.send(command, params),
  }
}

export default createModel(useCommand)
