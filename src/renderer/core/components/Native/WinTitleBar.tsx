import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { remote } from 'electron';

import WinMinimize from '@core/components/Icons/WinMinimize';
import WinMaximize from '@core/components/Icons/WinMaximize';
import WinClose from '@core/components/Icons/WinClose';

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
      color: '#fff',
    },
  },
}));

export default function WinTitleBar() {
  const classes = useStyles();
  const win = React.useMemo(() => remote.getGlobal('managers').coreManager, []);
  const handleMinimize = React.useCallback(() => {
    win?.minimize();
  }, [win]);
  const handleClose = React.useCallback(() => {
    win?.hide();
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
