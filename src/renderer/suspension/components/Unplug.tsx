import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import clsx from 'clsx';
import { useMount } from 'ahooks';
import { remote } from 'electron';

import { config } from '@shared/store';
import useUnplug from '@suspension/hooks/useUnplug';

import Loading from './Loading';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 80,
    height: 52,
    position: 'absolute',
    top: 32,
    left: '50%',
    zIndex: 2,
    transform: 'translateX(-50%)',
    background: `url('${
      require('@shared/assets/images/unplug_bg.png').default
    }') no-repeat`,
    backgroundSize: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: `all ${theme.transitions.easing.sharp} ${theme.transitions.duration.shortest}ms`,
    '&:hover': {
      top: 58,
      filter: 'drop-shadow(0px 0px 6px #f9cd0d)',
    },
    '& > *': {
      marginTop: -6,
    },
  },
  active: {
    top: 58,
    filter: 'drop-shadow(0px 0px 6px #f9cd0d)',
  },
  button: {
    width: 34,
    height: 34,
    background: `url('${
      require('@shared/assets/images/expression.png').default
    }') no-repeat`,
    backgroundSize: 140,
    backgroundPosition: '-103px -40px',
  },
}));

const Unplug: React.FC = () => {
  const classes = useStyles();
  const { loading, tooltip, unplug } = useUnplug();

  useMount(() => {
    const shortcut = (config.get('shortcuts.unplug') as string) ?? 'F1';
    remote.globalShortcut.register(shortcut, unplug);
    return () => {
      remote.globalShortcut.unregisterAll();
    };
  });

  return (
    <Tooltip title={tooltip} placement="top" arrow>
      <div
        className={clsx(classes.root, {
          [classes.active]: loading,
        })}
        onClick={unplug}
      >
        {loading ? (
          <Loading size="small" />
        ) : (
          <div className={classes.button} />
        )}
      </div>
    </Tooltip>
  );
};

export default Unplug;
