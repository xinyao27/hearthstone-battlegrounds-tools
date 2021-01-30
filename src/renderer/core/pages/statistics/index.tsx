import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useInViewport, useUpdateEffect } from 'ahooks'

import useRecord from '@shared/hooks/useRecord'

import BlackBox from './BlackBox'
import Table from './Table'
import RecentHeroes from './RecentHeroes'
import LineChart from './LineChart'

const useStyles = makeStyles(() => ({
  '@global': {
    body: {
      color: '#e6e7e9',
      background: `url(${
        require('@shared/assets/images/bg.jpg').default
      }) no-repeat`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backdropFilter: 'blur(5px)',
    },
  },
  root: {},
  head: {
    display: 'flex',
  },
}))

const Statistics: React.FC = () => {
  const classes = useStyles()
  const [, { refresh }] = useRecord()
  const rootRef = React.useRef<HTMLDivElement>(null)

  const inViewPort = useInViewport(rootRef)
  useUpdateEffect(() => {
    if (inViewPort) {
      refresh()
    }
  }, [inViewPort])

  return (
    <div className={classes.root}>
      <BlackBox className={classes.head}>
        <RecentHeroes />
        <LineChart />
      </BlackBox>
      <BlackBox>
        <Table />
      </BlackBox>
    </div>
  )
}

export default Statistics
