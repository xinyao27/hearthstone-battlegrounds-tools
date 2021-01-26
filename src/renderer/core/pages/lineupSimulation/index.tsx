import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Checkerboard from './Checkerboard'

const useStyles = makeStyles(() => ({
  root: {},
}))

const LineupSimulation: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Checkerboard />
    </div>
  )
}

export default LineupSimulation
