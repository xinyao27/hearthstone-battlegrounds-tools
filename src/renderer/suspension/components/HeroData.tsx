import React from 'react';
import type { EChartOption } from 'echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import { Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { getHeroAnalysis, ListHeroesResult } from '@shared/api';
import Text from '@suspension/components/Text';
import Loading from '@suspension/components/Loading';
import { useRequest } from 'ahooks';

interface ChartProps {
  hero?: ListHeroesResult[0];
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
  if (hero) {
    return (
      <ReactEchartsCore
        echarts={echarts}
        option={option}
        style={{ height: 60 }}
      />
    );
  }
  return null;
};

const useStyles = makeStyles((theme) => ({
  error: {
    width: '100%',
    marginBottom: theme.spacing(6),
    '& > img': {
      width: '50%',
      margin: '0 auto',
    },
  },
  noData: {
    textAlign: 'center',
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
  },

  chart: {
    marginTop: theme.spacing(1),
  },
}));

interface HeroDataProps {
  id: number;
}

const HeroData: React.FC<HeroDataProps> = ({ id }) => {
  const classes = useStyles();
  const { data, loading, error, refresh } = useRequest(getHeroAnalysis, {
    cacheKey: 'heroes',
    cacheTime: 30 * 60 * 1000,
  });
  const heroData = data?.find((v) => v.hero_dbf_id === id);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className={classes.error} onClick={refresh}>
        <img
          src={require('@shared/assets/images/error.png').default}
          alt="error"
        />
        <Text>数据加载失败 请点击叉号重试</Text>
      </div>
    );
  }

  if (data) {
    return (
      <>
        <div className={classes.data}>
          <Tooltip title="英雄的平均最终排名" arrow placement="top">
            <div className={classes.card}>
              <Text className={classes.label} stroke={false} color="black">
                平均排名
              </Text>
              <Text className={classes.value} isNumber>
                {heroData?.avg_final_placement?.toFixed(2) ?? 0}
              </Text>
            </div>
          </Tooltip>

          <Tooltip
            title="对局开始出现该英雄时 该英雄被选取的百分率"
            arrow
            placement="top"
          >
            <div className={classes.card}>
              <Text className={classes.label} stroke={false} color="black">
                选择率
              </Text>
              <Text className={classes.value} isNumber>
                {`${heroData?.pick_rate.toFixed(2) ?? 0}%`}
              </Text>
            </div>
          </Tooltip>
        </div>
        <Tooltip
          title="每一条代表该英雄得到这个名次的频率"
          arrow
          placement="bottom"
        >
          <div className={classes.chart}>
            <Chart hero={heroData} />
          </div>
        </Tooltip>
      </>
    );
  }

  return <Text className={classes.noData}>没有足够的数据</Text>;
};

export default HeroData;
