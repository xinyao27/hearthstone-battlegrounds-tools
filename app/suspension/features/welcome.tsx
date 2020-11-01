import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import useListHeroes from '../hooks/useListHeroes';
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
  const { data, loading } = useListHeroes();

  return (
    <Layout className={classes.root}>
      <div>玛维影歌</div>
      <Link to={routes.HEROSELECTION}>to heroes</Link>
    </Layout>
  );
};

export default Welcome;
