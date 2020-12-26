import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import _ from 'lodash';

import Layout from '@suspension/components/Layout';
import SwitchBattleAndHandbook from '@suspension/components/SwitchBattleAndHandbook';
import MinionCard from '@suspension/components/MinionCard';
import Text from '@suspension/components/Text';
import type { CacheMinion } from '@shared/types';
import useMinions from '@shared/hooks/useMinions';

interface TierList {
  [tier: number]: CacheMinion[];
}
interface TierRaceList {
  [tier: number]: Record<number, CacheMinion[]>;
}
function groupByTier(list: CacheMinion[]) {
  return list.reduce<TierList>((acc, cur) => {
    const { tier } = cur;
    if (tier) {
      return {
        ...acc,
        [tier]: Array.isArray(acc[tier]) ? [...acc[tier], cur] : [cur],
      };
    }
    return acc;
  }, {});
}
function groupByRace(list: TierList) {
  return Object.keys(list).reduce<TierRaceList>((acc, cur) => {
    const minions = list[parseInt(cur, 10)];
    return {
      ...acc,
      [cur]: _.groupBy(minions, (value) => value.cardRace),
    };
  }, {});
}
function getTierCN(tier: number) {
  switch (tier) {
    case 1:
      return '一';
    case 2:
      return '二';
    case 3:
      return '三';
    case 4:
      return '四';
    case 5:
      return '五';
    case 6:
      return '六';
    default:
      return '一';
  }
}
function getRaceCN(tier: number) {
  switch (tier) {
    case 0:
      return '中立';
    case 14:
      return '鱼人';
    case 15:
      return '恶魔';
    case 17:
      return '机械';
    case 18:
      return '元素';
    case 20:
      return '野兽';
    case 23:
      return '海盗';
    case 24:
      return '龙';
    default:
      return '所有';
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  switch: {},
  switchItem: {
    display: 'inline-block',
    width: 34,
    filter: 'grayscale(1)',
    transition: `all ${theme.transitions.easing.sharp} ${theme.transitions.duration.shortest}ms`,
    '&:hover': {
      filter: 'grayscale(0.2) drop-shadow(0px 0px 2px #f9cd0d)',
    },
  },
  switchItemActive: {
    filter: 'grayscale(0) drop-shadow(0px 0px 6px #f9cd0d)',
  },
  group: {},
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  minions: {},
  race: {
    marginBottom: theme.spacing(1),
  },
}));

const Handbook: React.FC = () => {
  const classes = useStyles();
  const { minions } = useMinions();
  const tierData = groupByTier(
    minions.filter((v) => !!v.upgradeId && v.official)
  );
  const tierRaceData = groupByRace(tierData);
  const [currentTier, setCurrentTier] = React.useState<number>(1);

  return (
    <Layout className={classes.root}>
      <SwitchBattleAndHandbook current="handbook" />

      <div className={classes.switch}>
        {[1, 2, 3, 4, 5, 6].map((tier) => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <img
            className={clsx(classes.switchItem, {
              [classes.switchItemActive]: tier === currentTier,
            })}
            src={require(`@shared/assets/images/tier-${tier}.png`).default}
            alt="tier"
            onClick={() => setCurrentTier(tier)}
            key={tier}
          />
        ))}
      </div>

      <div className={classes.group}>
        <div className={classes.title}>
          <Text>{`${getTierCN(currentTier)}星酒馆`}</Text>
        </div>

        <div className={classes.minions}>
          {tierRaceData?.[currentTier] &&
            Object.keys(tierRaceData?.[currentTier])?.map((race) => {
              const raceNumber = parseInt(race, 10);
              const raceMinions = tierRaceData?.[currentTier]?.[raceNumber];
              return (
                <div key={race}>
                  <Text className={classes.race} color="#45331d" stroke={false}>
                    {getRaceCN(raceNumber)}
                  </Text>
                  {raceMinions?.map((minion) => (
                    <MinionCard
                      minionName={minion.name}
                      props={{ TECH_LEVEL: currentTier.toString() }}
                      key={minion.id}
                    />
                  ))}
                </div>
              );
            })}
        </div>
      </div>
    </Layout>
  );
};

export default Handbook;
