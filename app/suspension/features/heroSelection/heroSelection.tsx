import React from 'react';
import { useUpdateEffect } from 'ahooks';
import { useHistory } from 'react-router-dom';

import Layout from '../../components/Layout';
import HeroCard from './HeroCard';
import useStateFlow from '../../hooks/useStateFlow';
import routes from '../../constants/routes.json';
import { getHeroId } from '../../utils';

const HeroSelection: React.FC = () => {
  const history = useHistory();
  const [stateFlow] = useStateFlow();

  useUpdateEffect(() => {
    if (stateFlow?.current === 'GAME_OVER') {
      history.push(routes.GAMEOVER);
    }
  }, [stateFlow]);

  return (
    <Layout>
      {stateFlow?.current === 'HERO_TOBE_CHOSEN' &&
        stateFlow?.HERO_TOBE_CHOSEN.result.map((name: string) => (
          <HeroCard heroId={getHeroId(name)} key={name} />
        ))}
      <HeroCard heroId={58435} />
    </Layout>
  );
};

export default HeroSelection;
