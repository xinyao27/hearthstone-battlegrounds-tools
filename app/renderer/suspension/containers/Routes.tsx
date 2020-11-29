import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Loading from '@suspension/components/Loading';
import routes from '@suspension/constants/routes.json';

import App from './App';

const LazyWelcomePage = React.lazy(
  () =>
    import(/* webpackChunkName: "WelcomePage" */ '@suspension/pages/welcome')
);
const WelcomePage = (props: Record<string, any>) => (
  <React.Suspense fallback={<Loading />}>
    <LazyWelcomePage {...props} />
  </React.Suspense>
);
const LazyHeroSelectionPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "HeroSelectionPage" */ '@suspension/pages/heroSelection'
    )
);
const HeroSelectionPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<Loading />}>
    <LazyHeroSelectionPage {...props} />
  </React.Suspense>
);
const LazyBattlePage = React.lazy(
  () => import(/* webpackChunkName: "BattlePage" */ '@suspension/pages/battle')
);
const BattlePage = (props: Record<string, any>) => (
  <React.Suspense fallback={<Loading />}>
    <LazyBattlePage {...props} />
  </React.Suspense>
);
const LazyHandbookPage = React.lazy(
  () =>
    import(/* webpackChunkName: "HandbookPage" */ '@suspension/pages/handbook')
);
const HandbookPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<Loading />}>
    <LazyHandbookPage {...props} />
  </React.Suspense>
);
const LazyGameOverPage = React.lazy(
  () =>
    import(/* webpackChunkName: "GameOverPage" */ '@suspension/pages/gameOver')
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
        <Route path={routes.BATTLE} component={BattlePage} />
        <Route path={routes.HANDBOOK} component={HandbookPage} />
        <Route path={routes.GAMEOVER} component={GameOverPage} />
      </Switch>
    </App>
  );
}
