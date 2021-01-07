import React from 'react';
import { shell } from 'electron';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip, Tabs, Tab, IconButton } from '@material-ui/core';
import TodayIcon from '@material-ui/icons/Today';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import CasinoIcon from '@material-ui/icons/Casino';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory, useLocation } from 'react-router-dom';
import { useUpdateEffect } from 'ahooks';

import routes from '@core/constants/routes.json';
import Logo from '@core/components/Icons/Logo';
import useStartHS from '@core/hooks/useStartHS';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 78,
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(0, 0, 0, 0.8)',
    color: theme.palette.common.white,
    paddingTop: 30,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    marginBottom: theme.spacing(3),
    '& > svg': {
      fontSize: '2.5em',
    },
  },
  nav: {},
  item: {
    minWidth: 78,
  },
  startGame: {
    width: 56,
  },
}));

export default function Navigation() {
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();

  const [value, setValue] = React.useState(() =>
    location.pathname === '/' ? '/record' : location.pathname
  );

  const handleChange = React.useCallback(
    (_: React.ChangeEvent<unknown>, newValue: string) => {
      setValue(newValue);
      history.push(newValue);
    },
    [history]
  );
  const handleToWebSite = React.useCallback(() => {
    shell.openExternal('https://hs.chenyueban.com');
  }, []);
  const { run } = useStartHS();

  useUpdateEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  return (
    <aside className={classes.root}>
      <Tooltip title="HBT - 炉石传说酒馆战棋插件" placement="right" arrow>
        <div className={classes.logo} onClick={handleToWebSite}>
          <Logo />
        </div>
      </Tooltip>
      <div className={classes.container}>
        <Tabs
          className={classes.nav}
          value={value}
          onChange={handleChange}
          orientation="vertical"
        >
          <Tab
            className={classes.item}
            label="战绩"
            value={routes.RECORD}
            icon={<TodayIcon />}
          />
          <Tab
            className={classes.item}
            label="统计"
            value={routes.STATISTICS}
            icon={<EqualizerIcon />}
          />
          <Tab
            className={classes.item}
            label="阵容模拟"
            value={routes.LINEUP_SIMULATION}
            icon={<CasinoIcon />}
          />
          <Tab
            className={classes.item}
            label="设置"
            value={routes.SETTINGS}
            icon={<SettingsIcon />}
          />
        </Tabs>

        <div>
          <Tooltip title="启动炉石传说" placement="right" arrow>
            <IconButton
              className={classes.startGame}
              onClick={run}
              color="primary"
            >
              <img
                src={
                  require('@shared/assets/images/hearthstone_icon.png').default
                }
                alt="hearthstone_icon"
              />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </aside>
  );
}
