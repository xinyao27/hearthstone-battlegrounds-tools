import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import TodayIcon from '@material-ui/icons/Today';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import SettingsIcon from '@material-ui/icons/Settings';
import { useHistory, useLocation } from 'react-router-dom';
import { useUpdateEffect } from 'ahooks';

import routes from '@app/constants/routes.json';

export default function Navigation() {
  const history = useHistory();
  const location = useLocation();

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

  useUpdateEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  return (
    <BottomNavigation value={value} onChange={handleChange}>
      <BottomNavigationAction
        label="战绩"
        value={routes.RECORD}
        icon={<TodayIcon />}
      />
      <BottomNavigationAction
        label="统计"
        value={routes.STATISTICS}
        icon={<EqualizerIcon />}
      />
      <BottomNavigationAction
        label="设置"
        value={routes.SETTINGS}
        icon={<SettingsIcon />}
      />
    </BottomNavigation>
  );
}
