import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import heroes from '../../constants/heroes.json';
import Loading from '../components/Loading';
import Text from '../components/Text';

const useStyles = makeStyles(() => ({
  root: {
    width: 260,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: 300,
    background: `url(${
      require('../assets/images/gameover_bg.png').default
    }) no-repeat`,
    backgroundSize: '100%',
    overflow: 'hidden',
  },
  hero: {
    width: '48%',
    margin: '13% auto 0',
  },
  rank: {
    textAlign: 'center',
    marginTop: '-5%',
  },

  tip: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: '4%',
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
    <div className={classes.root}>
      {hero ? (
        <div className={classes.container}>
          <div className={classes.hero}>
            <img src={hero.battlegrounds.image} alt={hero.name} />
          </div>

          <Text className={classes.rank}>第二名</Text>

          <Text className={classes.tip} color="#bb6bde">
            已记录本场战绩
          </Text>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default GameOver;
