import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { remote } from 'electron';

import WinMinimize from '@app/components/Icons/WinMinimize';
import WinMaximize from '@app/components/Icons/WinMaximize';
import WinClose from '@app/components/Icons/WinClose';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 135,
    height: 30,
    '-webkit-app-region': 'no-drag',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    overflow: 'hidden',
    '& > div': {
      height: '100%',
      flex: 1,
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 16,
      transition: `background ${theme.transitions.easing.sharp} ${theme.transitions.duration.shortest}ms`,
    },
  },
  minimize: {
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  close: {
    '&:hover': {
      backgroundColor: '#e81123',
    },
  },
}));

export default function WinTitleBar() {
  const classes = useStyles();
  const win = React.useMemo(() => remote.getCurrentWindow(), []);
  const handleMinimize = React.useCallback(() => {
    win?.minimize();
  }, [win]);
  const handleClose = React.useCallback(() => {
    win?.close();
  }, [win]);

  return (
    <div className={classes.root}>
      <div className={classes.minimize} onClick={handleMinimize}>
        <WinMinimize />
      </div>
      <div>
        <WinMaximize />
      </div>
      <div className={classes.close} onClick={handleClose}>
        <WinClose />
      </div>
    </div>
  );
}
