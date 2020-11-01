import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: 80,
    height: 80,
    background: `url(${
      require('../assets/images/loading.png').default
    }) no-repeat`,
    backgroundSize: '100%',
    backgroundPosition: '0 24px',
  },
  img: {},
}));

const Loading: React.FC = () => {
  const classes = useStyles();

  return <div className={classes.root} />;
};

export default Loading;
