import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { is } from 'electron-util';

import WinTitleBar from '@core/components/Native/WinTitleBar';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 30,
    zIndex: 5000,
  },
  dragger: {
    flex: 1,
    '-webkit-app-region': 'drag',
    userSelect: 'none',
  },
  title: {
    paddingLeft: theme.spacing(1),
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.dragger} />
      {is.windows && <WinTitleBar />}
    </div>
  );
}
