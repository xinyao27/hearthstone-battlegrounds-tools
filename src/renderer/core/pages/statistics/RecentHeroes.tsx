import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import useRecord from '@shared/hooks/useRecord'
import useStatistics from '@shared/hooks/useStatistics'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    textIndent: 12,
  },
  content: {},
  hero: {
    width: 110,
    display: 'inline-flex',
    alignItems: 'center',
    position: 'relative',
  },
  info: {
    width: '84%',
    position: 'absolute',
    left: '8%',
    bottom: '7%',
    background: 'rgba(0,0,0,0.4)',
    color: '#e6e7e9',
    fontSize: 10,
    padding: '2px 6px',
  },
}))

const RecentHeroes: React.FC = () => {
  const classes = useStyles()
  const [recordList] = useRecord()
  const list = useStatistics(recordList)

  const [first, second, third] = list || []

  return (
    <div className={classes.root}>
      <div className={classes.title}>排名最高英雄</div>
      <div className={classes.content}>
        {first && (
          <div className={classes.hero}>
            <img src={first.heroAvatar} alt={first.heroName} />
            <div className={classes.info}>
              <div>平均排名：{first.averageRanking}</div>
              <div>选择率： {(first.selectRate * 100).toFixed(2)}%</div>
            </div>
          </div>
        )}
        {second && (
          <div className={classes.hero}>
            <img src={second.heroAvatar} alt={second.heroName} />
            <div className={classes.info}>
              <div>平均排名：{second.averageRanking}</div>
              <div>选择率： {(second.selectRate * 100).toFixed(2)}%</div>
            </div>
          </div>
        )}
        {third && (
          <div className={classes.hero}>
            <img src={third.heroAvatar} alt={third.heroName} />
            <div className={classes.info}>
              <div>平均排名：{third.averageRanking}</div>
              <div>选择率： {(third.selectRate * 100).toFixed(2)}%</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentHeroes
