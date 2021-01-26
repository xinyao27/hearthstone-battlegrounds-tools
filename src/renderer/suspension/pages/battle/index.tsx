import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useToggle } from 'ahooks'

import Layout from '@suspension/components/Layout'
import Text from '@suspension/components/Text'
import SwitchBattleAndHandbook from '@suspension/components/SwitchBattleAndHandbook'
import useBattleState from '@suspension/hooks/useBattleState'

import Opponent from './Opponent'

const useStyles = makeStyles((theme) => ({
  round: {
    height: 40,
    fontSize: 18,
    lineHeight: '42px',
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    background: `url(${
      require('@shared/assets/images/class_headers_wild.png').default
    }) no-repeat`,
    backgroundSize: 500,
    backgroundPosition: '-22px -10px',
  },
  container: {
    minHeight: 400,
    borderStyle: 'solid',
    borderWidth: '12px 0 0',
    borderImage: `url("${
      require('@shared/assets/images/battle_border.png').default
    }") 27 27 27 fill stretch`,
    margin: '0 -27px',
    padding: '0 27px',
    position: 'relative',
  },
  head: {
    width: 178,
    height: 25,
    fontSize: 16,
    textAlign: 'center',
    background: `url(${
      require('@shared/assets/images/battle_title.png').default
    }) no-repeat`,
    backgroundSize: '100% 100%',
    position: 'absolute',
    left: '50%',
    top: -12,
    transform: 'translateX(-50%)',
    display: 'flex',
    justifyContent: 'center',
    '& > *': {
      width: 70,
      transition: `all ${theme.transitions.easing.sharp} ${theme.transitions.duration.shortest}ms`,
      '&:hover': {
        filter: 'drop-shadow(2px 4px 6px black)',
      },
    },
  },
  currentOpponent: {
    marginTop: theme.spacing(2),
  },
  previous: {
    marginTop: theme.spacing(7),
    marginBottom: -theme.spacing(5),
    textAlign: 'center',
    fontSize: 16,
  },
  allOpponents: {
    marginTop: theme.spacing(2),
  },
}))

const Battle: React.FC = () => {
  const classes = useStyles()

  const {
    currentTurn,
    currentOpponent,
    currentOpponentLineup,
    previousOpponent,
    previousOpponentLineup,
    allOpponentLineup,
  } = useBattleState()

  const [visible, { toggle: toggleVisible }] = useToggle<'current' | 'all'>(
    'current'
  )

  return (
    <Layout>
      <SwitchBattleAndHandbook current="battle" />

      <Text className={classes.round}>{`第${currentTurn}回合`}</Text>

      <div className={classes.container}>
        <div className={classes.head}>
          <Text
            color={visible === 'current' ? 'white' : '#45331d'}
            stroke={false}
            onClick={() => toggleVisible('current')}
          >
            当前对手
          </Text>
          <Text
            color={visible === 'all' ? 'white' : '#45331d'}
            stroke={false}
            onClick={() => toggleVisible('all')}
          >
            全部对手
          </Text>
        </div>

        {visible === 'current' && (
          <div>
            <Opponent
              hero={currentOpponent?.hero}
              opponentLineup={currentOpponentLineup}
            />
            {previousOpponent && (
              <>
                <Text
                  className={classes.previous}
                  color="#45331d"
                  stroke={false}
                >
                  上一次的对手
                </Text>
                <Opponent
                  hero={previousOpponent?.hero}
                  opponentLineup={previousOpponentLineup}
                  simplified
                />
              </>
            )}
          </div>
        )}
        {visible === 'all' &&
          allOpponentLineup?.map((opponent) => (
            <Opponent
              hero={opponent?.hero}
              opponentLineup={opponent}
              simplified
              key={opponent?.hero}
            />
          ))}
      </div>
    </Layout>
  )
}

export default Battle
