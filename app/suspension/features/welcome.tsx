import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import Layout from '../components/Layout';
import routes from '../constants/routes.json';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    fontSize: 40,
  },
}));

const Welcome: React.FC = () => {
  const classes = useStyles();

  return (
    <Layout className={classes.root}>
      <Link to={routes.HEROSELECTION}>to heroes</Link>
      <Link to={routes.GAMEOVER}>to gameover</Link>
    </Layout>
  );
};

export default Welcome;
