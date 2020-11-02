import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import { useUpdateEffect } from 'ahooks';

import Layout from '../components/Layout';
import routes from '../constants/routes.json';
import useStateFlow from '../hooks/useStateFlow';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    fontSize: 40,
  },
}));

const Welcome: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [stateFlow] = useStateFlow();

  useUpdateEffect(() => {
    if (stateFlow?.current === 'GAME_START') {
      history.push(routes.HEROSELECTION);
    }
  }, [stateFlow]);

  return (
    <Layout className={classes.root}>
      <Link to={routes.HEROSELECTION}>to heroes</Link>
      <Link to={routes.GAMEOVER}>to gameover</Link>
    </Layout>
  );
};

export default Welcome;
