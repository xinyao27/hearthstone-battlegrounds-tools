import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grow } from '@material-ui/core';
import { useBoolean } from 'ahooks';
import clsx from 'clsx';

import HeroCard from '@suspension/components/HeroCard';
import MinionCard from '@suspension/components/MinionCard';
import Text from '@suspension/components/Text';
import { getHeroId } from '@suspension/utils';
import useStateFlow from '@suspension/hooks/useStateFlow';
import type { OpponentLineup } from '@suspension/types';

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
}));

export interface OpponentProps {
  hero?: string;
  opponentLineup?: OpponentLineup;
  simplified?: boolean;
}

const Opponent: React.FC<OpponentProps> = ({
  hero,
  opponentLineup,
  simplified = false,
}) => {
  const classes = useStyles();
  const [stateFlow] = useStateFlow();
  const [unfolded, { toggle: toggleUnfolded }] = useBoolean(!simplified);
  const currentTurn = stateFlow?.TURN?.result;
  const turn =
    parseInt(currentTurn, 10) - parseInt(opponentLineup?.turn as string, 10);

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
          />
        )}
        <Grow in={unfolded} style={{ transformOrigin: '0 0 0' }}>
          <div>
            {!!turn && !!opponentLineup?.minions?.length && (
              <Text className={classes.turn}>{`${turn}个回合前`}</Text>
            )}
            {opponentLineup?.minions?.length ? (
              opponentLineup?.minions?.map((minion: any) => (
                <MinionCard
                  minionName={minion.name}
                  props={minion.props}
                  key={minion.id}
                />
              ))
            ) : (
              <Text className={classes.tip}>还没有对局数据哦</Text>
            )}
          </div>
        </Grow>
      </div>
    );
  }
  return <Text className={classes.tip}>很抱歉没有检测到对手</Text>;
};

export default Opponent;
