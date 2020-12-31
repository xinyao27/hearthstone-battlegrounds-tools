import React, { Fragment } from 'react';
import { render } from 'react-dom';

import { monitor } from '@shared/utils';

import logHandler from './logHandler';
import SuspensionRoot from './suspension/containers/Root';
import CoreRoot from './core/containers/Root';

function getQuery() {
  return new URLSearchParams(window.location.search);
}

(() => {
  const AppContainer = Fragment;

  switch (getQuery().get('type')) {
    case 'logHandler':
      monitor('renderer', 'logHandler');
      logHandler();
      break;
    case 'suspension':
      monitor('renderer', 'suspension');
      render(
        <AppContainer>
          <SuspensionRoot />
        </AppContainer>,
        document.getElementById('root')
      );
      break;
    default:
      monitor('renderer', 'core');
      render(
        <AppContainer>
          <CoreRoot />
        </AppContainer>,
        document.getElementById('root')
      );
      break;
  }
})();
