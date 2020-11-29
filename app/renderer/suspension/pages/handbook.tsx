import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Layout from '@suspension/components/Layout';
import SwitchBattleAndHandbook from '@suspension/components/SwitchBattleAndHandbook';
import MinionCard from '@suspension/components/MinionCard';
import Text from '@suspension/components/Text';
import minions from '@shared/constants/minions.json';

interface TierList {
  [tier: number]: typeof minions;
}
function groupByTier(list: typeof minions) {
  return list.reduce<TierList>((acc, cur) => {
    const { tier } = cur.battlegrounds;
    return {
      ...acc,
      [tier]: Array.isArray(acc[tier]) ? [...acc[tier], cur] : [cur],
    };
  }, {});
}
function getTierCN(tier: string) {
  switch (tier) {
    case '1':
      return '一';
    case '2':
      return '二';
    case '3':
      return '三';
    case '4':
      return '四';
    case '5':
      return '五';
    case '6':
      return '六';
    default:
      return '一';
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  group: {},
  title: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    '& > img': {
      display: 'inline-block',
      width: 40,
    },
    '& > p': {
      display: 'inline-block',
      marginLeft: theme.spacing(1),
    },
  },
  minions: {},
}));

const Handbook: React.FC = () => {
  const classes = useStyles();
  const data = groupByTier(minions);

  return (
    <Layout className={classes.root}>
      <SwitchBattleAndHandbook current="handbook" />

      {Object.keys(data)?.map((tier) => (
        <div className={classes.group} key={tier}>
          <div className={classes.title}>
            <img
              src={require(`@shared/assets/images/tier-${tier}.png`).default}
              alt="tier"
            />
            <Text>{`${getTierCN(tier)}星酒馆`}</Text>
          </div>

          <div className={classes.minions}>
            {data?.[(tier as unknown) as number]?.map((minion) => (
              <MinionCard
                minionName={minion.name}
                props={{ TECH_LEVEL: tier }}
                key={minion.id}
              />
            ))}
          </div>
        </div>
      ))}
    </Layout>
  );
};

export default Handbook;
