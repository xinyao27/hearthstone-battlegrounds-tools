import React from 'react';

import Layout from '@suspension/components/Layout';
import HeroCard from '@suspension/components/HeroCard';
import useStateFlow from '@suspension/hooks/useStateFlow';
import { getHeroId } from '@suspension/utils';

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
