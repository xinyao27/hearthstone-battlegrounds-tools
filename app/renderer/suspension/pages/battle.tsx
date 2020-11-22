import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Layout from '@suspension/components/Layout';
import HeroCard from '@suspension/components/HeroCard';
import Text from '@suspension/components/Text';
import useStateFlow from '@suspension/hooks/useStateFlow';
import { getHeroId } from '@suspension/utils';

const useStyles = makeStyles((theme) => ({
  round: {
    height: 40,
    fontSize: 18,
    lineHeight: '42px',
    textAlign: 'center',
    margin: `${theme.spacing(2)}px 0`,
    background: `url(${
      require('@shared/assets/images/class_headers_wild.png').default
    }) no-repeat`,
    backgroundSize: 500,
    backgroundPosition: '-22px -10px',
  },
  container: {
    minHeight: 400,
    borderStyle: 'solid',
    borderWidth: 12,
    borderImage: `url("${
      require('@shared/assets/images/battle_border.png').default
    }") 27 27 27 fill stretch`,
    margin: '0 -27px',
    padding: '0 27px',
    position: 'relative',
  },
  head: {
    width: 120,
    fontSize: 14,
    textAlign: 'center',
    background: `url(${
      require('@shared/assets/images/battle_title.png').default
    }) no-repeat`,
    backgroundSize: '100% 100%',
    position: 'absolute',
    left: '50%',
    top: -12,
    transform: 'translateX(-50%)',
  },
  opponent: {},
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

        <div className={classes.container}>
          <Text className={classes.head} stroke={false}>
            你的对手
          </Text>
          <div className={classes.opponent}>
            <HeroCard
              heroId={getHeroId(opponent?.hero || '辛达苟萨')}
              displayData={false}
            />
          </div>
        </div>
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
