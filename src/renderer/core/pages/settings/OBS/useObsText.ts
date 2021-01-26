import React from 'react'
import { createModel } from 'hox'
import { useUpdateEffect } from 'ahooks'

import { config } from '@shared/store'

import type { RequestMethodReturnMap } from './types'
import useCommand from './useCommand'
import useConnect from './useConnect'

function useObsText() {
  const { run } = useCommand()
  const { connected } = useConnect()
  const [sourcesList, setSourcesList] = React.useState<
    RequestMethodReturnMap['GetSourcesList']['sources']
  >([])
  const [enable, setEnable] = React.useState<boolean>(
    (config.get('obs.text.enable') as boolean) ?? false
  )
  const [currentSource, setCurrentSource] = React.useState<string>(() => {
    const configSource = config.get('obs.text.source') as string
    if (sourcesList.find((v) => v.name === configSource)) {
      return configSource
    }
    return ''
  })
  const [max, setMax] = React.useState<number>(
    (config.get('obs.text.max') as number) ?? 12
  )

  const handleEnable = React.useCallback(
    (result: boolean) => {
      setEnable((pre) => {
        if (!currentSource && !pre) {
          // eslint-disable-next-line no-alert
          alert('请设置文本来源')
          return pre
        }
        config.set('obs.text.enable', result)
        return result
      })
    },
    [currentSource]
  )
  const handleSetCurrentSource = React.useCallback((result: string) => {
    setCurrentSource(() => {
      config.set('obs.text.source', result)
      return result
    })
  }, [])
  const handleSetMax = React.useCallback((result: number) => {
    setMax(() => {
      config.set('obs.text.max', result)
      return result
    })
  }, [])

  useUpdateEffect(() => {
    async function getSourcesList() {
      const res = await run('GetSourcesList')
      if (res) {
        const filtered = res.sources.filter(
          (v) => v.typeId === 'text_gdiplus_v2'
        )
        setSourcesList(filtered)
        const configSource = config.get('obs.text.source') as string
        const hasConfig = filtered.find((v) => v.name === configSource)
        if (configSource && hasConfig) {
          setCurrentSource(configSource)
        }
        if (!hasConfig) {
          handleEnable(false)
        }
      }
    }
    if (connected) getSourcesList()
  }, [connected])

  return {
    enable,
    setEnable: handleEnable,
    sourcesList,
    currentSource,
    setCurrentSource: handleSetCurrentSource,
    max,
    setMax: handleSetMax,
  }
}

export default createModel(useObsText)
