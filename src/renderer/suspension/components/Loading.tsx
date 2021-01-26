import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

interface LoadingProps {
  size?: 'small' | 'normal'
}

const useStyles = makeStyles(() => ({
  '@keyframes spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  root: {
    background: `url(${
      require('@shared/assets/images/loading_bg.png').default
    }) no-repeat`,
    backgroundSize: '100%',
    margin: '0 auto',
    position: 'relative',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      background: `url(${
        require('@shared/assets/images/loading_line.png').default
      }) no-repeat`,
      backgroundSize: '86%',
      backgroundPosition: 'center',
      animation: '$spin 3s infinite ease',
      filter: 'brightness(150%) opacity(80%) saturate(150%)',
    },
  },
  img: {},
  sizeSmall: {
    width: 34,
    height: 34,
  },
  sizeNormal: {
    width: 80,
    height: 80,
  },
}))

const Loading: React.FC<LoadingProps> = ({ size = 'normal' }) => {
  const classes = useStyles()

  return (
    <div
      className={clsx(classes.root, {
        [classes.sizeSmall]: size === 'small',
        [classes.sizeNormal]: size === 'normal',
      })}
    />
  )
}

export default Loading
