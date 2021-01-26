import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

import routes from '@suspension/constants/routes.json'

import Text from './Text'

interface SwitchBattleAndHandbookProps {
  current: 'battle' | 'handbook'
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  battle: {
    textDecoration: 'none',
    filter: 'grayscale(1)',
    width: 56,
    transition: `all ${theme.transitions.easing.sharp} ${theme.transitions.duration.shortest}ms`,
    '&:hover': {
      filter: 'grayscale(0.3) drop-shadow(0px 0px 6px #f9cd0d)',
    },
  },
  handbook: {
    textDecoration: 'none',
    filter: 'grayscale(1)',
    width: 56,
    transition: `all ${theme.transitions.easing.sharp} ${theme.transitions.duration.shortest}ms`,
    '&:hover': {
      filter: 'grayscale(0.3) drop-shadow(0px 0px 6px #f9cd0d)',
    },
  },
  select: {
    filter: 'grayscale(0) drop-shadow(0px 0px 6px #f9cd0d)',
  },
}))

const SwitchBattleAndHandbook: React.FC<SwitchBattleAndHandbookProps> = ({
  current,
}) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Link
        className={clsx(classes.battle, {
          [classes.select]: current === 'battle',
        })}
        to={routes.BATTLE}
      >
        <img
          src={require('@shared/assets/images/battle.png').default}
          alt="battle"
        />
        <Text>对战情况</Text>
      </Link>
      <Link
        className={clsx(classes.handbook, {
          [classes.select]: current === 'handbook',
        })}
        to={routes.HANDBOOK}
      >
        <img
          src={require('@shared/assets/images/crown.png').default}
          alt="handbook"
        />
        <Text>战棋图鉴</Text>
      </Link>
    </div>
  )
}

export default SwitchBattleAndHandbook
