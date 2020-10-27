import React from "react"
import { createModel } from "hox"

import useCommand from "./useCommand"
import useConnect from "./useConnect"

function useObsText() {
  const { run } = useCommand()
  const { connected } = useConnect()
  const [sourcesList, setSourcesList] = React.useState([])
  const [currentSource, setCurrentSource] = React.useState()

  React.useEffect(() => {
    async function getSourcesList() {
      const res = await run("GetSourcesList")
      if (res) {
        setSourcesList(res.sources.filter(v => v.typeId === "text_gdiplus_v2"))
      }
    }
    if (connected) getSourcesList()
  }, [connected, run])

  return {
    sourcesList,
    currentSource,
    setCurrentSource,
  }
}

export default createModel(useObsText)
