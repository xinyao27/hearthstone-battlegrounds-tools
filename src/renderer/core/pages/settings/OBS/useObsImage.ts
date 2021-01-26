import React from 'react'
import { createModel } from 'hox'

import { config } from '@shared/store'

function useObsImage() {
  const [enable, setEnable] = React.useState<boolean>(
    (config.get('obs.image.enable') as boolean) ?? false
  )
  const [dir, setDir] = React.useState<string>(
    (config.get('obs.image.dir') as string) ?? ''
  )
  const [max, setMax] = React.useState<number>(
    (config.get('obs.image.max') as number) ?? 12
  )

  const handleEnable = React.useCallback(
    (result: boolean) => {
      setEnable((pre) => {
        if (!dir && !pre) {
          // eslint-disable-next-line no-alert
          alert('未设置图片储存路径')
          return pre
        }
        config.set('obs.image.enable', result)
        return result
      })
    },
    [dir]
  )
  const handleSetDir = React.useCallback((result: string) => {
    setDir(() => {
      config.set('obs.image.dir', result)
      return result
    })
  }, [])
  const handleSetMax = React.useCallback((result: number) => {
    setMax(() => {
      config.set('obs.image.max', result)
      return result
    })
  }, [])

  return {
    enable,
    setEnable: handleEnable,
    dir,
    setDir: handleSetDir,
    max,
    setMax: handleSetMax,
  }
}

export default createModel(useObsImage)
