import React from 'react';
import { hot } from 'react-hot-loader/root';
import { createHashHistory } from 'history';
import { Router } from 'react-router-dom';

import Routes from './Routes';

const history = createHashHistory();

const Root = () => {
  const children = <Routes />;

  return <Router history={history}>{children}</Router>;
};

export default hot(Root);
