import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import routes from '@core/constants/routes.json';
import RecordPage from '@core/pages/record';
import StatisticsPage from '@core/pages/statistics';
import LineupSimulation from '@core/pages/lineupSimulation';
import SettingsPage from '@core/pages/settings';

import App from './App';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route exact path="/">
          <Redirect to={routes.RECORD} />
        </Route>
        <Route path={routes.RECORD} component={RecordPage} />
        <Route path={routes.STATISTICS} component={StatisticsPage} />
        <Route path={routes.LINEUP_SIMULATION} component={LineupSimulation} />
        <Route path={routes.SETTINGS} component={SettingsPage} />
      </Switch>
    </App>
  );
}
