import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Loading from '../components/Loading';
import routes from '../constants/routes.json';
import App from './App';

const LazyWelcomePage = React.lazy(
  () => import(/* webpackChunkName: "WelcomePage" */ '../features/welcome')
);
const WelcomePage = (props: Record<string, any>) => (
  <React.Suspense fallback={<Loading />}>
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
  <React.Suspense fallback={<Loading />}>
    <LazyHeroSelectionPage {...props} />
  </React.Suspense>
);
const LazyGameOverPage = React.lazy(
  () => import(/* webpackChunkName: "GameOverPage" */ '../features/gameOver2')
);
const GameOverPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<Loading />}>
    <LazyGameOverPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route exact path={routes.WELCOME} component={WelcomePage} />
        <Route path={routes.HEROSELECTION} component={HeroSelectionPage} />
        <Route path={routes.GAMEOVER} component={GameOverPage} />
      </Switch>
    </App>
  );
}
