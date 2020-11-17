import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  useBoolean,
  useCreation,
  useDebounceFn,
  useUpdateEffect,
} from 'ahooks';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { v4 as uuid } from 'uuid';

import Layout from '@suspension/components/Layout';
import Text from '@suspension/components/Text';
import useStateFlow from '@suspension/hooks/useStateFlow';
import { getHero, getHeroId } from '@suspension/utils';
import { getStore } from '@shared/store';
import { Topic } from '@shared/constants/topic';
import useBoxFlow from '@suspension/hooks/useBoxFlow';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(4),
  },
  container: {},
  hero: {},
  head: {
    height: 80,
    background: `url(${
      require('@shared/assets/images/message_box.png').default
    }) no-repeat`,
    backgroundSize: '100%',
    position: 'relative',
  },
  headText: {
    width: '50%',
    position: 'absolute',
    left: '25%',
    top: '71%',
    textAlign: 'center',
  },
  avatar: {
    width: '80%',
    margin: '12px auto 0',
  },
  name: {
    height: 40,
    fontSize: 18,
    lineHeight: '42px',
    textAlign: 'center',
    marginTop: -10,
    background: `url(${
      require('@shared/assets/images/class_headers.png').default
    }) no-repeat`,
    backgroundSize: 500,
    backgroundPosition: '-22px -10px',
  },
  rank: {
    width: '90%',
    height: 220,
    margin: '68px auto 0',
    position: 'relative',
    background: `url(${
      require('@shared/assets/images/card_bg.png').default
    }) no-repeat`,
    backgroundSize: '100%',
    filter: 'brightness(120%) saturate(120%)',
  },
  crown: {
    width: 80,
    height: 90,
    position: 'absolute',
    left: '50%',
    top: -40,
    marginLeft: -40,
    zIndex: 1,
    background: `url(${
      require('@shared/assets/images/crown3.png').default
    }) no-repeat`,
    backgroundSize: '100%',
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: 22,
    marginTop: 40,
    position: 'relative',
    '&::before, &::after': {
      content: '""',
      width: '70%',
      height: 2,
      position: 'absolute',
      left: '15%',
      borderRadius: 2,
      backgroundColor: '#5a3602',
    },
    '&::before': {
      top: 0,
    },
    '&::after': {
      bottom: 0,
    },
  },
  value: {
    width: '70%',
    height: 120,
    fontSize: 46,
    textAlign: 'center',
    lineHeight: '86px',
    marginTop: theme.spacing(1),
    background: `url(${
      require('@shared/assets/images/olive.png').default
    }) no-repeat`,
    backgroundSize: '100%',
  },
  tip: {
    textAlign: 'center',
    fontSize: 22,
    marginTop: theme.spacing(2),
  },
}));

const store = getStore();

const GameOver: React.FC = () => {
  const classes = useStyles();
  const [stateFlow] = useStateFlow();
  const [boxFlow] = useBoxFlow();
  const [error, { toggle: setError }] = useBoolean(false);

  const data = useCreation(() => {
    if (stateFlow?.current === 'GAME_OVER') {
      setError(false);
      if (stateFlow.HERO_CHOICES?.result) {
        const [heroName] = stateFlow.HERO_CHOICES.result;
        const heroId = getHeroId(heroName);
        const hero = getHero(heroId);
        if (stateFlow.GAME_RANKING?.result) {
          const heroRank = stateFlow.GAME_RANKING.result;
          return [hero, heroRank];
        }
        return [hero, '8'];
      }
    }
    return [null, null];
  }, [stateFlow]);

  const { run } = useDebounceFn(
    () => {
      const [hero, rank] = data;
      if (hero && rank) {
        const date = new Date();
        const record = {
          id: uuid(),
          hero: {
            id: hero.id,
            name: hero.name,
          },
          rank,
          date,
        };
        store.dispatch<Topic.ADD_RECORD>({
          type: Topic.ADD_RECORD,
          payload: record,
        });
      }
    },
    { wait: 500 }
  );
  useDeepCompareEffect(() => {
    run();
  }, [data]);
  useUpdateEffect(() => {
    if (boxFlow?.current === 'BOX_GAME_OVER') {
      if (stateFlow?.current !== 'GAME_OVER') {
        setError(true);
      }
    }
  }, [boxFlow?.current]);

  const [hero, rank] = data;

  if (error) {
    return (
      <Layout>
        <Text>
          检测到对局可能非正常结束，本局战绩已忽略。您可以选择忽略此消息或到插件战绩栏手动记录战绩
        </Text>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={classes.container}>
        {hero && (
          <div className={classes.hero}>
            <div className={classes.head}>
              <Text className={classes.headText} color="#e9dd52">
                对局结束
              </Text>
            </div>
            <div className={classes.avatar}>
              <img src={hero.battlegrounds.image} alt={hero.name} />
            </div>
            <Text className={classes.name}>{hero.name}</Text>
          </div>
        )}

        <div className={classes.rank}>
          <div className={classes.crown} />
          <div className={classes.content}>
            <Text className={classes.title} stroke={false} color="black">
              当局排名
            </Text>
            <Text className={classes.value}>{rank}</Text>
          </div>
        </div>

        <Text className={classes.tip} stroke={false} color="black">
          已记录本场战绩
        </Text>
      </div>
    </Layout>
  );
};

export default GameOver;
