import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import type { IMinion } from '@hbt-org/core';
import _ from 'lodash';

import Layout from '@suspension/components/Layout';
import SwitchBattleAndHandbook from '@suspension/components/SwitchBattleAndHandbook';
import MinionCard from '@suspension/components/MinionCard';
import Text from '@suspension/components/Text';
import useMinions from '@shared/hooks/useMinions';

interface TierList {
  [techLevel: number]: IMinion[];
}
interface TierRaceList {
  [race: string]: Record<string, IMinion[]>;
}
function groupByTier(list: IMinion[]) {
  return list.reduce<TierList>((acc, cur) => {
    const { techLevel } = cur;
    if (techLevel) {
      return {
        ...acc,
        [techLevel]: Array.isArray(acc[techLevel])
          ? [...acc[techLevel], cur]
          : [cur],
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
      [cur]: _.groupBy(minions, (value) => value.race ?? 'INVALID'),
    };
  }, {});
}
function getTierCN(techLevel: number) {
  switch (techLevel) {
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
function getRaceCN(race: string) {
  switch (race) {
    case 'INVALID':
      return '中立';
    case 'MURLOC':
      return '鱼人';
    case 'DEMON':
      return '恶魔';
    case 'MECHANICAL':
      return '机械';
    case 'ELEMENTAL':
      return '元素';
    case 'BEAST':
      return '野兽';
    case 'PIRATE':
      return '海盗';
    case 'DRAGON':
      return '龙';
    case 'ALL':
      return '所有';
    default:
      return '中立';
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
  const techLevelData = groupByTier(
    minions.filter((v) => !!v.battlegroundsPremiumDbfId && v.official)
  );
  const techLevelRaceData = groupByRace(techLevelData);
  const [currentTier, setCurrentTier] = React.useState<number>(1);

  return (
    <Layout className={classes.root}>
      <SwitchBattleAndHandbook current="handbook" />

      <div className={classes.switch}>
        {[1, 2, 3, 4, 5, 6].map((techLevel) => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <img
            className={clsx(classes.switchItem, {
              [classes.switchItemActive]: techLevel === currentTier,
            })}
            src={
              require(`@shared/assets/images/techLevel-${techLevel}.png`)
                .default
            }
            alt="techLevel"
            onClick={() => setCurrentTier(techLevel)}
            key={techLevel}
          />
        ))}
      </div>

      <div className={classes.group}>
        <div className={classes.title}>
          <Text>{`${getTierCN(currentTier)}星酒馆`}</Text>
        </div>

        <div className={classes.minions}>
          {techLevelRaceData?.[currentTier] &&
            Object.keys(techLevelRaceData?.[currentTier])?.map((race) => {
              const raceMinions = techLevelRaceData?.[currentTier]?.[race];
              return (
                <div key={race}>
                  <Text className={classes.race} color="#45331d" stroke={false}>
                    {getRaceCN(race)}
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
