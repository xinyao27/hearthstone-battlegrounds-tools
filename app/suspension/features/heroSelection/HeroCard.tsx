import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import type { EChartOption } from 'echarts';

import heroes from '../../../constants/heroes.json';
import useListHeroes, { ListHeroesResult } from '../../hooks/useListHeroes';

interface ChartProps {
  hero: ListHeroesResult['series']['data'][0] & typeof heroes[0];
}
const Chart: React.FC<ChartProps> = ({ hero }) => {
  const option = React.useMemo<EChartOption>(
    () => ({
      color: ['#714822'],
      grid: {
        left: '0',
        // right: '0',
        top: '0',
        bottom: '0',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: `第{b}名: {c}%`,
      },
      xAxis: {
        type: 'category',
        data: [1, 2, 3, 4, 5, 6, 7, 8],
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: 'bar',
          barWidth: '80%',
          data: hero?.final_placement_distribution,
        },
      ],
    }),
    [hero]
  );
  return (
    <ReactEchartsCore
      echarts={echarts}
      option={option}
      style={{ height: 60 }}
    />
  );
};

interface HeroCardProps {
  heroId: number;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(4),
  },

  title: {
    position: 'relative',
    minHeight: 110,
  },
  avatar: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 80,
    zIndex: 2,
  },
  nameBar: {
    position: 'relative',
    top: 56,
    height: 22,
    zIndex: 1,
    backgroundColor: '#dbb991',
    margin: '0 -27px',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -6,
      width: '100%',
      height: 4,
      backgroundColor: '#dbb991',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -6,
      width: '100%',
      height: 4,
      backgroundColor: '#dbb991',
    },
  },
  name: {
    position: 'absolute',
    left: 86,
    bottom: 28,
    zIndex: 2,
    width: 124,
    fontSize: 20,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  data: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    width: 90,
    height: 70,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(219, 185, 145, 0.2)',
    padding: `${theme.spacing(1)}px 0`,
  },
  label: {
    fontSize: 20,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
  },

  chart: {
    marginTop: theme.spacing(1),
  },
}));

const HeroCard: React.FC<HeroCardProps> = ({ heroId }) => {
  const classes = useStyles();
  const { data, loading } = useListHeroes();
  const hero = React.useMemo(() => {
    const resource = heroes.find((v) => v.id === heroId);
    const heroData = data?.series.data.find((v) => v.hero_dbf_id === heroId);
    return Object.assign(resource, heroData);
  }, [heroId, data]);

  if (data && hero) {
    return (
      <div className={classes.root}>
        <div className={classes.title}>
          <div className={classes.avatar}>
            <img src={hero.battlegrounds.image} alt={hero.name} />
          </div>
          <div className={classes.nameBar} />
          <div className={classes.name}>{hero.name}</div>
        </div>

        <div className={classes.data}>
          <div className={classes.card}>
            <div className={classes.label}>平均排名</div>
            <div className={classes.value}>
              {hero?.avg_final_placement?.toFixed(2)}
            </div>
          </div>
          <div className={classes.card}>
            <div className={classes.label}>选择率</div>
            <div className={classes.value}>{hero?.pick_rate?.toFixed(2)}%</div>
          </div>
        </div>

        <div className={classes.chart}>
          <Chart hero={hero} />
        </div>
      </div>
    );
  }

  return null;
};

export default HeroCard;
