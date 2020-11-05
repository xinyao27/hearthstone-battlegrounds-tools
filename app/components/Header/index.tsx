import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <img
            src="https://static.hsreplay.net/static/images/battlegrounds/icons/heroes.svg"
            alt="icons"
          />
          <Typography variant="h6" className={classes.title}>
            酒馆战棋战绩统计
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}
