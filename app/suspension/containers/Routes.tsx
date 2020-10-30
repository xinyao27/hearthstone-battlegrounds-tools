import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createHashHistory } from 'history';

import routes from '../constants/routes.json';
import App from './App';

const history = createHashHistory();

const LazyWelcomePage = React.lazy(
  () => import(/* webpackChunkName: "WelcomePage" */ '../features/Welcome')
);
const WelcomePage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyWelcomePage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <Router history={history}>
      <App>
        <Switch>
          <Route path={routes.WELCOME} component={WelcomePage} />
        </Switch>
      </App>
    </Router>
  );
}
