import React from 'react';

import Layout from '@suspension/components/Layout';
import HeroCard from '@suspension/components/HeroCard';
import Text from '@suspension/components/Text';
import useStateFlow from '@suspension/hooks/useStateFlow';
import useHeroes from '@shared/hooks/useHeroes';

const HeroSelection: React.FC = () => {
  const [stateFlow] = useStateFlow();
  const { getHeroId } = useHeroes();

  return (
    <Layout>
      {stateFlow?.HERO_TOBE_CHOSEN?.result?.length ? (
        stateFlow.HERO_TOBE_CHOSEN.result.map((name: string) => (
          <HeroCard heroId={getHeroId(name)} key={name} />
        ))
      ) : (
        <Text>抱歉没有查询到可选英雄的数据，也许下一盘就好啦</Text>
      )}
    </Layout>
  );
};

export default HeroSelection;
