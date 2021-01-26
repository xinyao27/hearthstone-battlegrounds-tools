import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grow } from '@material-ui/core'
import { useBoolean } from 'ahooks'
import clsx from 'clsx'

import HeroCard from '@suspension/components/HeroCard'
import MinionCard from '@suspension/components/MinionCard'
import Text from '@suspension/components/Text'
import Loading from '@suspension/components/Loading'
import useStateFlow from '@suspension/hooks/useStateFlow'
import useBattleState from '@suspension/hooks/useBattleState'
import type { OpponentLineup } from '@suspension/types'
import useHeroes from '@shared/hooks/useHeroes'
import useLineupModel from '@shared/hooks/useLineupModel'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  turn: {
    textAlign: 'center',
    marginBottom: theme.spacing(1),
  },
  tip: {
    textAlign: 'center',
  },
  toggle: {
    position: 'relative',
    top: -58,
    left: 13,
    zIndex: 3,
    width: 34,
    height: 28,
    background: `url(${
      require('@shared/assets/images/view.png').default
    }) no-repeat`,
    backgroundSize: '100% 100%',
    filter: 'grayscale(0.8)',
    transition: `all ${theme.transitions.easing.sharp} ${theme.transitions.duration.shortest}ms`,
    '&:hover': {
      filter: 'grayscale(0.4) drop-shadow(0px 0px 6px #f9cd0d)',
    },
  },
  toggleActive: {
    filter: 'grayscale(0) drop-shadow(0px 0px 6px #f9cd0d)',
  },
  combatPower: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  card: {
    width: 90,
    height: 70,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(219, 185, 145, 0.2)',
    padding: `${theme.spacing(1)}px 0`,
  },
  label: {
    fontSize: 20,
  },
  minions: {
    marginTop: theme.spacing(2),
  },
  value: {
    fontSize: 20,
  },
}))

export interface OpponentProps {
  hero?: string
  opponentLineup?: OpponentLineup
  simplified?: boolean
}

const Opponent: React.FC<OpponentProps> = ({
  hero,
  opponentLineup,
  simplified = false,
}) => {
  const classes = useStyles()
  const [stateFlow] = useStateFlow()
  const { getHeroId } = useHeroes()
  const { ownLineup } = useBattleState()
  const [unfolded, { toggle: toggleUnfolded }] = useBoolean(!simplified)
  const currentTurn = stateFlow?.TURN?.result
  const turn =
    parseInt(currentTurn, 10) - parseInt(opponentLineup?.turn as string, 10)
  const {
    combatPower: opponentCombatPower,
    loading: opponentLoading,
  } = useLineupModel(
    opponentLineup?.minions?.length ? opponentLineup.minions : [],
    true
  )
  const { combatPower: ownCombatPower, loading: ownLoading } = useLineupModel(
    ownLineup?.length ? ownLineup : [],
    true
  )

  if (hero) {
    return (
      <div className={classes.root}>
        <HeroCard
          heroId={getHeroId(hero || '辛达苟萨')}
          displayData={false}
          mini
        />
        {simplified && (
          <div
            className={clsx(classes.toggle, {
              [classes.toggleActive]: unfolded,
            })}
            onClick={() => toggleUnfolded()}
            role="button"
            tabIndex={0}
          />
        )}
        <Grow in={unfolded} style={{ transformOrigin: '0 0 0' }}>
          <div
            style={{
              marginTop: simplified ? -28 : 0,
              height: unfolded ? 'auto' : 0,
            }}
          >
            {!!turn && !!opponentLineup?.minions?.length && (
              <Text className={classes.turn}>{`${turn}个回合前`}</Text>
            )}
            {opponentLineup?.minions?.length ? (
              <div>
                <div className={classes.combatPower}>
                  <div className={classes.card}>
                    {ownLoading ? (
                      <Loading size="small" />
                    ) : (
                      <>
                        <Text
                          className={classes.label}
                          stroke={false}
                          color="black"
                        >
                          我的战力
                        </Text>
                        <Text className={classes.value} isNumber>
                          {ownCombatPower}
                        </Text>
                      </>
                    )}
                  </div>
                  <div className={classes.card}>
                    {opponentLoading ? (
                      <Loading size="small" />
                    ) : (
                      <>
                        <Text
                          className={classes.label}
                          stroke={false}
                          color="black"
                        >
                          对手战力
                        </Text>
                        <Text className={classes.value} isNumber>
                          {opponentCombatPower}
                        </Text>
                      </>
                    )}
                  </div>
                </div>
                <div className={classes.minions}>
                  {opponentLineup?.minions?.map((minion) => (
                    <MinionCard
                      minionName={minion.name}
                      props={minion.props}
                      key={minion.id}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <Text className={classes.tip}>还没有对局数据哦</Text>
            )}
          </div>
        </Grow>
      </div>
    )
  }
  return <Text className={classes.tip}>很抱歉没有检测到对手</Text>
}

export default Opponent
