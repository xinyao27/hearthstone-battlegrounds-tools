import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grow, Tooltip } from '@material-ui/core';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import type { EChartOption } from 'echarts';

import heroes from '@shared/constants/heroes.json';
import useListHeroes, {
  ListHeroesResult,
} from '@suspension/hooks/useListHeroes';
import Text from '@suspension/components/Text';
import Loading from '@suspension/components/Loading';
import { getImageUrl } from '@suspension/utils';

type Hero = typeof heroes[0] & {
  heroData?: ListHeroesResult[0];
};
interface ChartProps {
  hero: Hero;
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
          data: hero?.heroData?.final_placement_distribution,
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
  displayData?: boolean;
  mini?: boolean;
}

const useStyles = makeStyles((theme) => ({
  error: {
    width: '100%',
    marginBottom: theme.spacing(6),
    '& > img': {
      width: '50%',
      margin: '0 auto',
    },
  },
  root: {
    width: '100%',
    marginBottom: theme.spacing(4),
  },
  noData: {
    textAlign: 'center',
  },

  title: {
    position: 'relative',
    minHeight: 110,
  },
  avatar: {
    position: 'absolute',
    left: 0,
    top: (props: HeroCardProps) => (props.mini ? theme.spacing(2) : 0),
    width: (props: HeroCardProps) => (props.mini ? 60 : 80),
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
  },

  chart: {
    marginTop: theme.spacing(1),
  },
}));
const useStylesTooltip = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
  },
}));

const HeroCard: React.FC<HeroCardProps> = (props) => {
  const { heroId, displayData } = props;
  const classes = useStyles(props);
  const tooltipClasses = useStylesTooltip();
  const { data, loading, error, refresh } = useListHeroes();
  const hero = React.useMemo<Hero | null>(() => {
    const resource = heroes.find((v) => v.id === heroId);
    const heroData = data?.find((v) => v.hero_dbf_id === heroId);
    if (resource && heroData) {
      return Object.assign(resource ?? {}, { heroData });
    }
    return null;
  }, [heroId, data]);

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

  if (data && hero) {
    return (
      <Grow in={!!hero} style={{ transformOrigin: '0 0 0' }} timeout={300}>
        <div
          className={classes.root}
          style={!displayData ? { marginBottom: 0 } : {}}
        >
          <div className={classes.title}>
            <div className={classes.avatar}>
              <img src={getImageUrl(hero.image)} alt={hero.name} />
            </div>
            <div className={classes.nameBar} />
            <Tooltip
              classes={tooltipClasses}
              title={hero.name}
              arrow
              placement="top"
            >
              <div className={classes.name}>{hero.name}</div>
            </Tooltip>
          </div>

          {displayData ? (
            hero.heroData ? (
              <>
                <div className={classes.data}>
                  <Tooltip
                    classes={tooltipClasses}
                    title="英雄的平均最终排名"
                    arrow
                    placement="top"
                  >
                    <div className={classes.card}>
                      <Text
                        className={classes.label}
                        stroke={false}
                        color="black"
                      >
                        平均排名
                      </Text>
                      <Text className={classes.value} isNumber>
                        {hero.heroData.avg_final_placement.toFixed(2)}
                      </Text>
                    </div>
                  </Tooltip>

                  <Tooltip
                    classes={tooltipClasses}
                    title="对局开始出现该英雄时 该英雄被选取的百分率"
                    arrow
                    placement="top"
                  >
                    <div className={classes.card}>
                      <Text
                        className={classes.label}
                        stroke={false}
                        color="black"
                      >
                        选择率
                      </Text>
                      <Text className={classes.value} isNumber>
                        {`${hero.heroData.pick_rate.toFixed(2)}%`}
                      </Text>
                    </div>
                  </Tooltip>
                </div>
                <Tooltip
                  classes={tooltipClasses}
                  title="每一条代表该英雄得到这个名次的频率"
                  arrow
                  placement="bottom"
                >
                  <div className={classes.chart}>
                    <Chart hero={hero} />
                  </div>
                </Tooltip>
              </>
            ) : (
              <Text className={classes.noData}>没有足够的数据</Text>
            )
          ) : null}
        </div>
      </Grow>
    );
  }

  return null;
};

HeroCard.defaultProps = {
  displayData: true,
  mini: false,
};

export default HeroCard;
