import React from 'react';
import { HashRouter as Router } from 'react-router-dom';

import Routes from './Routes';

const Root = () => {
  const children = <Routes />;

  return <Router>{children}</Router>;
};

export default Root;
