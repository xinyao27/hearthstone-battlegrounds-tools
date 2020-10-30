import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history';

import routes from '../constants/routes.json';
import App from './App';

const history = createHashHistory();

const LazyRecordPage = React.lazy(
  () => import(/* webpackChunkName: "RecordPage" */ '../pages/record')
);
const RecordPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyRecordPage {...props} />
  </React.Suspense>
);
const LazyStatisticsPage = React.lazy(
  () => import(/* webpackChunkName: "StatisticsPage" */ '../pages/statistics')
);
const StatisticsPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyStatisticsPage {...props} />
  </React.Suspense>
);
const LazySettingsPage = React.lazy(
  () => import(/* webpackChunkName: "SettingsPage" */ '../pages/settings')
);
const SettingsPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazySettingsPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <Router history={history}>
      <App>
        <Switch>
          <Route exact path="/">
            <Redirect to={routes.RECORD} />
          </Route>
          <Route path={routes.RECORD} component={RecordPage} />
          <Route path={routes.STATISTICS} component={StatisticsPage} />
          <Route path={routes.SETTINGS} component={SettingsPage} />
        </Switch>
      </App>
    </Router>
  );
}
