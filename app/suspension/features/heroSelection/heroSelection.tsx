import React from 'react';
import { Link } from 'react-router-dom';

import routes from '../../constants/routes.json';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import HeroCard from './HeroCard';

const HeroSelection: React.FC = () => {
  return (
    <Layout>
      <Loading />
      <Link to={routes.WELCOME}>to home</Link>
      <HeroCard heroId={58435} />
      <HeroCard heroId={60213} />
      <HeroCard heroId={60372} />
      <HeroCard heroId={64400} />
    </Layout>
  );
};

export default HeroSelection;
