import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  '@keyframes spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  root: {
    width: 80,
    height: 80,
    background: `url(${
      require('../assets/images/loading_bg.png').default
    }) no-repeat`,
    backgroundSize: '100%',
    margin: '0 auto',
    position: 'relative',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      background: `url(${
        require('../assets/images/loading_line.png').default
      }) no-repeat`,
      backgroundSize: '86%',
      backgroundPosition: 'center',
      animation: '$spin 3s infinite ease',
      filter: 'brightness(150%) opacity(80%) saturate(150%)',
    },
  },
  img: {},
}));

const Loading: React.FC = () => {
  const classes = useStyles();

  return <div className={classes.root} />;
};

export default Loading;
