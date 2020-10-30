import React from 'react';
import { Switch, Route } from 'react-router-dom';

import routes from '../constants/routes.json';
import App from './App';

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
    <App>
      <Switch>
        <Route path={routes.WELCOME} component={WelcomePage} />
      </Switch>
    </App>
  );
}
