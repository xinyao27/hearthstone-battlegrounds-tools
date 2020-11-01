import React from 'react';
import { Switch, Route } from 'react-router-dom';

import routes from '../constants/routes.json';
import App from './App';

const LazyWelcomePage = React.lazy(
  () => import(/* webpackChunkName: "WelcomePage" */ '../features/welcome')
);
const WelcomePage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyWelcomePage {...props} />
  </React.Suspense>
);
const LazyHeroSelectionPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "HeroSelectionPage" */ '../features/heroSelection'
    )
);
const HeroSelectionPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyHeroSelectionPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route exact path={routes.WELCOME} component={WelcomePage} />
        <Route path={routes.HEROSELECTION} component={HeroSelectionPage} />
      </Switch>
    </App>
  );
}
