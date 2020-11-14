import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';

import logHandler from './logHandler';
import SuspensionRoot from './suspension/containers/Root';
import CoreRoot from './core/containers/Root';

function getQuery() {
  return new URLSearchParams(window.location.search);
}

(() => {
  const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

  switch (getQuery().get('type')) {
    case 'logHandler':
      logHandler();
      break;
    case 'suspension':
      document.addEventListener('DOMContentLoaded', () => {
        render(
          <AppContainer>
            <SuspensionRoot />
          </AppContainer>,
          document.getElementById('root')
        );
      });
      break;
    default:
      document.addEventListener('DOMContentLoaded', () => {
        render(
          <AppContainer>
            <CoreRoot />
          </AppContainer>,
          document.getElementById('root')
        );
      });
      break;
  }
})();
