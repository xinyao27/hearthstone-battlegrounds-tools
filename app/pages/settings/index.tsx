import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { ipcRenderer } from 'electron';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  tools: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(9),
    right: theme.spacing(2),
  },
}));

export default function Settings() {
  const classes = useStyles();

  const handleSuspensionVisible = React.useCallback(() => {
    ipcRenderer.send('showSuspension');
  }, []);

  return (
    <div className={classes.root}>
      settings
      <Button onClick={handleSuspensionVisible}>打开悬浮</Button>
    </div>
  );
}
