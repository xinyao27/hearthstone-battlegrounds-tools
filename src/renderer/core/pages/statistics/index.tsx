import React from 'react'

import Table from './Table'
import LineChart from './LineChart'
import useRecord from '@shared/hooks/useRecord'
import { useInViewport, useUpdateEffect } from 'ahooks'

const Statistics: React.FC = () => {
  const [, { refresh }] = useRecord()
  const rootRef = React.useRef<HTMLDivElement>(null)

  const inViewPort = useInViewport(rootRef)
  useUpdateEffect(() => {
    if (inViewPort) {
      refresh()
    }
  }, [inViewPort])

  return (
    <div>
      <LineChart />
      <Table />
    </div>
  )
}

export default Statistics
