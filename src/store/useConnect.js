import React from "react"
import { createModel } from "hox"

import useObs from "./useObs"
import useCommand from "./useCommand"

function useConnect() {
  const [connected, setConnected] = React.useState(false)
  const { obs } = useObs()
  const { run } = useCommand()

  const connect = React.useCallback(
    async (host = "localhost:4444", password = "") => {
      async function connect({ host = "localhost:4444", password = "" }) {
        let address = host
        let secure =
          window.location.protocol === "https:" || host.endsWith(":443")
        if (host.indexOf("://") !== -1) {
          let url = new URL(host)
          secure = url.protocol === "wss:" || url.protocol === "https:"
          address =
            url.hostname + ":" + (url.port ? url.port : secure ? 443 : 80)
        }
        console.log(`连接: ${address} - secure: ${secure} - 密码: ${password}`)
        if (connected === true) {
          await obs.disconnect()
          setConnected(false)
        }
        try {
          await obs.connect({ address, password, secure })
        } catch (e) {
          console.error(e)
        }
      }

      if (connected === false) await connect({ host, password })
    },
    [connected, obs]
  )
  const disconnect = React.useCallback(async () => {
    await obs.disconnect()
  }, [obs])

  React.useEffect(() => {
    // OBS events
    obs.on("ConnectionClosed", () => {
      setConnected(false)
      console.log("Connection closed")
    })
    obs.on("AuthenticationSuccess", async () => {
      console.log("Connected")
      setConnected(true)
      const version = (await run("GetVersion")).obsWebsocketVersion || ""
      console.log("OBS-websocket version:", version)
    })
    obs.on("AuthenticationFailure", async () => {
      alert("密码错误")
    })
  }, [obs, run])

  return {
    connect,
    disconnect,
    connected,
  }
}

export default createModel(useConnect)
