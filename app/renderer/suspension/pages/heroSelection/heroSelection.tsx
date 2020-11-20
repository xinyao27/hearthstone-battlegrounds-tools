import React from 'react';

import Layout from '@suspension/components/Layout';
import useStateFlow from '@suspension/hooks/useStateFlow';
import { getHeroId } from '@suspension/utils';

import HeroCard from './HeroCard';

const HeroSelection: React.FC = () => {
  const [stateFlow] = useStateFlow();

  return (
    <Layout>
      {stateFlow?.HERO_TOBE_CHOSEN?.result?.map((name: string) => (
        <HeroCard heroId={getHeroId(name)} key={name} />
      ))}
    </Layout>
  );
};

export default HeroSelection;
