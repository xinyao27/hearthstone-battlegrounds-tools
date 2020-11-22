import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Layout from '@suspension/components/Layout';
import HeroCard from '@suspension/components/HeroCard';
import Text from '@suspension/components/Text';
import useStateFlow from '@suspension/hooks/useStateFlow';
import { getHeroId } from '@suspension/utils';

const useStyles = makeStyles(() => ({
  round: {
    fontSize: 22,
    textAlign: 'center',
  },
  head: {
    height: 40,
    fontSize: 18,
    lineHeight: '42px',
    textAlign: 'center',
    background: `url(${
      require('@shared/assets/images/class_headers_wild.png').default
    }) no-repeat`,
    backgroundSize: 500,
    backgroundPosition: '-22px -10px',
  },
}));

const Battle: React.FC = () => {
  const classes = useStyles();
  const [stateFlow] = useStateFlow();

  const opponent = stateFlow?.NEXT_OPPONENT?.result;
  const turn = stateFlow?.TURN?.result;

  if (opponent) {
    return (
      <Layout>
        <Text className={classes.round}>{`第${turn}回合`}</Text>
        <Text className={classes.head}>你的对手</Text>
        <HeroCard
          heroId={getHeroId(opponent?.hero || '辛达苟萨')}
          displayData={false}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <Text>抱歉没有检测到下一轮的对手</Text>
    </Layout>
  );
};

export default Battle;
