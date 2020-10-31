import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useListHeroes from '../hooks/useListHeroes';

const useStyles = makeStyles(() => ({
  root: {
    padding: '2px 4px',
    background: '#000',
    width: 200,
    height: 200,
  },
}));

const Welcome: React.FC = () => {
  const classes = useStyles();
  const { data, loading } = useListHeroes();
  console.log(data, loading);
  return <div className={classes.root}>welcome</div>;
};

export default Welcome;
