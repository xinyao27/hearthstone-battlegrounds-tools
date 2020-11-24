import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import HeroCard from '@suspension/components/HeroCard';
import MinionCard from '@suspension/components/MinionCard';
import Text from '@suspension/components/Text';
import { getHeroId } from '@suspension/utils';
import type { Minion } from '@shared/types';
import useStateFlow from '@suspension/hooks/useStateFlow';

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
}));

export interface OpponentProps {
  hero: string;
  opponentLineup: {
    hero: string;
    turn: string;
    minions: {
      name: string;
      id: string;
      props: Minion;
    }[];
  };
}

const Opponent: React.FC<OpponentProps> = ({ hero, opponentLineup }) => {
  const classes = useStyles();
  const [stateFlow] = useStateFlow();
  const currentTurn = stateFlow?.TURN?.result;
  const turn = parseInt(currentTurn, 10) - parseInt(opponentLineup?.turn, 10);
  if (hero) {
    return (
      <div className={classes.root}>
        <HeroCard
          heroId={getHeroId(hero || '辛达苟萨')}
          displayData={false}
          mini
        />
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
    );
  }
  return <Text className={classes.tip}>很抱歉没有检测到对手</Text>;
};

export default Opponent;
