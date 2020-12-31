import React from 'react';
import { Switch, Route } from 'react-router-dom';

import routes from '@suspension/constants/routes.json';
import WelcomePage from '@suspension/pages/welcome';
import HeroSelectionPage from '@suspension/pages/heroSelection';
import BattlePage from '@suspension/pages/battle';
import HandbookPage from '@suspension/pages/handbook';
import GameOverPage from '@suspension/pages/gameOver';

import App from './App';

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
