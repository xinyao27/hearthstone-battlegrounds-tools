import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Box, Grow, Tooltip } from '@material-ui/core';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';

import { getMinion, getMinionId } from '@suspension/utils';
import Text from '@suspension/components/Text';
import { Minion } from '@shared/types';

const ImgTooltip = withStyles(() => ({
  tooltip: {
    background: 'none',
  },
}))(Tooltip);

interface MinionCardProps {
  minionName: string;
  props?: Minion;
}

const useStyles = makeStyles(() => ({
  root: {
    minWidth: 140,
    width: '94%',
    margin: '0 auto',
    position: 'relative',
    marginBottom: 18,
  },
  border: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: -1,
    width: '100%',
    height: '100%',
    borderStyle: 'solid',
    borderWidth: 12,
    borderImage: `url("${
      require('@shared/assets/images/border.png').default
    }") 27 27 31 fill stretch`,
    margin: -12,
    boxSizing: 'content-box',
  },
  container: {
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tooltip: {
    width: 180,
  },
  gold: {
    zIndex: 100,
    width: 30,
    height: 30,
    textAlign: 'center',
    lineHeight: '30px',
    fontSize: 22,
    background: `url('${
      require('@shared/assets/images/gold.png').default
    }') no-repeat`,
    backgroundSize: '100%',
    marginTop: -4,
    marginLeft: -18,
  },
  name: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  atk: {
    fontSize: 18,
  },
  health: {
    fontSize: 18,
  },
  divineShield: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
    width: '100%',
    height: '100%',
    background: `url('${
      require('@shared/assets/images/divine_shield.png').default
    }') no-repeat`,
    backgroundPosition: 'center',
    backgroundSize: '200% 320%',
  },
  bottomProps: {
    position: 'absolute',
    left: '50%',
    bottom: -12,
    zIndex: 10,
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  poisonous: {
    width: 16,
    height: 24,
    background: `url('${
      require('@shared/assets/images/poisonous.png').default
    }') no-repeat`,
    backgroundSize: '100%',
  },
  taunt: {
    zIndex: 10,
    width: 16,
    height: 22,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100%',
  },
}));

const MinionCard: React.FC<MinionCardProps> = ({ minionName, props = {} }) => {
  const classes = useStyles();

  const minion = React.useMemo(() => getMinion(getMinionId(minionName)), [
    minionName,
  ]);
  const {
    // 酒馆星级
    TECH_LEVEL,
    // 攻击力
    ATK,
    // 血量
    HEALTH,
    // 嘲讽
    TAUNT,
    // 风怒
    // WINDFURY,
    // 超级风怒
    // MEGA_WINDFURY,
    // 圣盾
    DIVINE_SHIELD,
    // 剧毒
    POISONOUS,
    // 金色随从
    BACON_MINION_IS_LEVEL_TWO,
  } = props;
  const imgSrc = BACON_MINION_IS_LEVEL_TWO
    ? minion?.battlegrounds?.imageGold
    : minion?.battlegrounds?.image;

  if (minionName) {
    return (
      <Grow
        in={!!minionName}
        style={{ transformOrigin: '0 0 0' }}
        timeout={300}
      >
        <div className={classes.root}>
          <div
            className={classes.border}
            style={{
              filter: `grayscale(${BACON_MINION_IS_LEVEL_TWO ? 0 : 1})`,
            }}
          />
          <ImgTooltip
            title={
              imgSrc ? (
                <img
                  className={classes.tooltip}
                  src={imgSrc}
                  alt={minionName}
                />
              ) : (
                ''
              )
            }
            placement="bottom"
          >
            <div
              className={classes.container}
              style={
                imgSrc
                  ? {
                      backgroundImage: `url(${imgSrc})`,
                      backgroundPosition: '38% 28%',
                      backgroundSize: '200%',
                    }
                  : {}
              }
            >
              {TECH_LEVEL && <Text className={classes.gold}>{TECH_LEVEL}</Text>}
              <Text className={classes.name}>{minionName}</Text>

              {ATK && HEALTH && (
                <Box display="flex" alignItems="center">
                  <Text className={classes.atk}>{ATK}</Text>
                  <Text className={classes.atk}>/</Text>
                  <Text className={classes.health}>{HEALTH}</Text>
                </Box>
              )}

              {DIVINE_SHIELD && <div className={classes.divineShield} />}
              <div className={classes.bottomProps}>
                {POISONOUS && <div className={classes.poisonous} />}
                {TAUNT && (
                  <div
                    className={classes.taunt}
                    style={{
                      backgroundImage: `url(${
                        // eslint-disable-next-line import/no-dynamic-require
                        require(`@shared/assets/images/${
                          BACON_MINION_IS_LEVEL_TWO ? 'taunt_gold' : 'taunt'
                        }.png`).default
                      })`,
                    }}
                  />
                )}
              </div>
            </div>
          </ImgTooltip>
        </div>
      </Grow>
    );
  }

  return null;
};

export default MinionCard;
