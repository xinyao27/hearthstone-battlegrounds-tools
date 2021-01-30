import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

interface BlackBoxProps {
  className?: string
}

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'rgba(0,0,0,.6)',
    backdropFilter: 'blur(5px)',
    borderRadius: 2,
    boxShadow: theme.shadows[2],
    margin: '5px 0',
  },
}))

const BlackBox: React.FC<BlackBoxProps> = (props) => {
  const classes = useStyles()
  return <div {...props} className={clsx(props.className, classes.root)} />
}

export default BlackBox
