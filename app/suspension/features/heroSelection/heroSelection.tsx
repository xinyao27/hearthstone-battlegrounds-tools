import React from 'react';

import Layout from '../../components/Layout';
import HeroCard from './HeroCard';
import useStateFlow from '../../hooks/useStateFlow';
import { getHeroId } from '../../utils';

const HeroSelection: React.FC = () => {
  const [stateFlow] = useStateFlow();

  return (
    <Layout>
      {stateFlow?.current === 'HERO_TOBE_CHOSEN' &&
        stateFlow?.HERO_TOBE_CHOSEN.result.map((name: string) => (
          <HeroCard heroId={getHeroId(name)} key={name} />
        ))}
    </Layout>
  );
};

export default HeroSelection;
