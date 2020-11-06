import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

import { getPlatform, Platform } from '@app/utils';

const useStyles = makeStyles((theme) => ({
  root: {
    '-webkit-app-region': 'drag',
    userSelect: 'none',
  },
  toolbar:
    getPlatform() === Platform.MACOS
      ? {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }
      : {},
  title: {
    paddingLeft: theme.spacing(1),
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <AppBar className={classes.root} position="static">
      <Toolbar className={classes.toolbar}>
        <img
          src="https://static.hsreplay.net/static/images/battlegrounds/icons/heroes.svg"
          alt="icons"
        />
        <Typography className={classes.title} variant="h6">
          酒馆战棋战绩统计
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
