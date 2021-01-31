import React from 'react'
import type { EChartOption } from 'echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/map/js/world'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import dayjs from 'dayjs'
import _ from 'lodash'
import { RecordItem } from '@shared/hooks/useStatistics'
import useRecord from '@shared/hooks/useRecord'
import { makeStyles } from '@material-ui/core/styles'

const TEMPLATE = 'YYYY-MM-DD'
function getPastDays(range: number) {
  const now = dayjs()
  return _.reverse(
    _.range(range).map((v) => now.subtract(v, 'days').format(TEMPLATE))
  )
}
function reorganizedByDays(list: RecordItem[], days: string[], range: number) {
  const now = dayjs()
  const previous = now.subtract(range, 'days')
  const initial = days.reduce(
    (pre, cur) => ({
      ...pre,
      [cur]: [],
    }),
    {}
  )
  return list.reduce<Record<string, RecordItem[]>>((pre, cur) => {
    const date = dayjs(cur.date)
    if (date.isBetween(now, previous, null, '[]')) {
      const key = date.format(TEMPLATE)
      return {
        ...pre,
        [key]: [...(pre[key] || []), cur],
      }
    }
    return pre
  }, initial)
}
function getAverageRanks(list: Record<string, RecordItem[]>) {
  return Object.keys(list).map((date) => {
    const value = list[date]
    return (
      value.reduce((pre, cur) => pre + parseInt(cur.rank, 10), 0) /
        value.length || 0
    )
  })
}

const useStyles = makeStyles(() => ({
  root: {
    flex: 1,
  },
}))

const LineChart: React.FC = () => {
  const classes = useStyles()
  const [recordList] = useRecord()
  const [range] = React.useState(7)
  const option = React.useMemo<EChartOption>(() => {
    const days = getPastDays(range)
    const averageRanks = getAverageRanks(
      reorganizedByDays(recordList, days, range)
    )
    return {
      title: {
        text: `最近7天平均排名`,
        textStyle: {
          color: '#e6e7e9',
          fontWeight: 'normal',
          fontSize: 12,
        },
        padding: [20, 50],
      },
      color: ['#ff943f'],
      // grid: {
      //   left: '0',
      //   // right: '0',
      //   top: '0',
      //   bottom: '0',
      //   containLabel: true,
      // },
      visualMap: [
        {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0,
          max: 400,
        },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
        formatter: `平均排名: {c}`,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        splitLine: { show: false },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#e6e7e9',
          },
        },
        data: days,
      },
      yAxis: {
        type: 'value',
        axisTick: { show: false },
        splitLine: { show: false },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#e6e7e9',
          },
        },
      },
      series: [
        {
          type: 'line',
          smooth: true,
          areaStyle: {
            color: 'rgba(255,148,63,.5)',
          },
          lineStyle: {
            width: 3,
            color: '#ff943f',
          },
          markLine: {
            data: [
              {
                type: 'average',
                name: '平均值',
              },
            ],
          },
          data: averageRanks,
        },
      ],
    }
  }, [range, recordList])

  return (
    <div className={classes.root}>
      <ReactEchartsCore
        echarts={echarts}
        option={option}
        // style={{ height: 60 }}
      />
    </div>
  )
}

export default LineChart
