import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import heroes from '../../constants/heroes.json';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import Text from '../components/Text';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(4),
  },
  hero: {},
  avatar: {
    width: '80%',
    margin: '0 auto',
  },
  name: {
    fontSize: 30,
    textAlign: 'center',
  },
  rank: {
    width: '90%',
    margin: '0 auto',
  },
  crown: {
    width: 80,
    height: 90,
    background: `url(${
      require('../assets/images/crown.png').default
    }) no-repeat`,
    backgroundSize: '100%',
    margin: '0 auto',
  },
  value: {
    height: 50,
    background: `url(${
      require('../assets/images/text_bg.png').default
    }) no-repeat`,
    backgroundSize: '100%',
    fontSize: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  olive: {
    width: 50,
    height: 50,
    background: `url(${
      require('../assets/images/olive.png').default
    }) no-repeat`,
    backgroundSize: '100%',
    position: 'absolute',
  },
  tip: {
    textAlign: 'center',
  },
}));

const GameOver: React.FC = () => {
  const classes = useStyles();

  const heroId = 58435;
  const rank = 2;

  const hero = React.useMemo(() => heroes.find((v) => v.id === heroId), [
    heroId,
  ]);

  return (
    <Layout>
      <Loading />
      {hero ? (
        <>
          <div className={classes.hero}>
            <div className={classes.avatar}>
              <img src={hero.battlegrounds.image} alt={hero.name} />
            </div>
            <Text className={classes.name}>{hero.name}</Text>
          </div>

          <div className={classes.rank}>
            <div className={classes.crown} />
            <div className={classes.value}>
              <Text>{rank}</Text>
              <div className={classes.olive} />
            </div>
            <div className={classes.tip}>已记录本场战绩</div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </Layout>
  );
};

export default GameOver;
