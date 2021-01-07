import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Menu, MenuItem } from '@material-ui/core';
import { Minion, minions as allMinions } from '@hbt-org/core';
import { getImageUrl } from '@suspension/utils';

import Text from '@suspension/components/Text';

function getMinion(dbfId: number) {
  return allMinions.find((minion) => minion.dbfId === dbfId);
}
// 判断是否为传说随从
function checkLegend(minion: Minion) {
  // 老瞎眼 卡德加 浴火者伯瓦尔 瑞文戴尔男爵 布莱恩·铜须 玛尔加尼斯 拜戈尔格国王 死神4000型 迈克斯纳 巨狼戈德林
  const minionsThatMayFall = [
    736,
    52502,
    45392,
    1915,
    2949,
    1986,
    60247,
    2081,
    1791,
    59955,
  ];
  return minionsThatMayFall.includes(minion.dbfId);
}

export interface EditProps {
  ATK?: number;
  HEALTH?: number;
  TAUNT?: boolean;
  DIVINE_SHIELD?: boolean;
  POISONOUS?: boolean;
}
interface MinionProps {
  minion: Minion;
  type: 'store' | 'minions';
  onChange?: (props: EditProps) => void;
}

const useStyles = makeStyles(() => ({
  root: {
    width: 128,
    height: 128,
    position: 'relative',
  },
  portrait: {
    width: '85%',
    position: 'absolute',
    left: '9%',
    top: '13%',
    clipPath: 'ellipse(35% 46% at 51% 50%)',
    '-webkit-clip-path': 'ellipse(35% 46% at 51% 50%)',
  },
  border: {
    position: 'absolute',
  },
  taunt: {
    width: '75%',
    position: 'absolute',
    left: '13%',
    top: '10%',
    zIndex: -1,
  },
  deathrattle: {
    position: 'absolute',
    left: 0,
    top: '-1%',
  },
  poisonous: {
    width: '16%',
    position: 'absolute',
    bottom: '-4%',
    left: '42.5%',
  },
  divineShield: {
    width: '115%',
    position: 'absolute',
    left: '-8%',
    top: '1%',
    opacity: 0.72,
  },
  legendary: {
    position: 'absolute',
  },
  atk: {
    width: 30,
    position: 'absolute',
    left: '18%',
    top: '68%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
  },
  health: {
    width: 30,
    position: 'absolute',
    left: '59%',
    top: '68%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
  },
}));

const initialState = {
  mouseX: null,
  mouseY: null,
};

const MinionComponent: React.FC<MinionProps> = ({ minion, type, onChange }) => {
  const classes = useStyles();
  const template = React.useMemo(() => getMinion(minion.dbfId), [minion]);

  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (type === 'minions') {
      event.preventDefault();
      setContextMenu({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
      });
    }
  };
  const handleClose = React.useCallback(() => {
    if (type === 'minions') {
      setContextMenu(initialState);
    }
  }, [type]);
  const handlePropsSetting = React.useCallback(
    (prop: 'taunt' | 'divineShield' | 'poisonous') => {
      switch (prop) {
        case 'taunt':
          onChange?.({
            TAUNT: !minion.TAUNT,
          });
          break;
        case 'divineShield':
          onChange?.({
            DIVINE_SHIELD: !minion.DIVINE_SHIELD,
          });
          break;
        case 'poisonous':
          onChange?.({
            POISONOUS: !minion.POISONOUS,
          });
          break;
        default:
          break;
      }
      handleClose();
    },
    [
      handleClose,
      minion.DIVINE_SHIELD,
      minion.POISONOUS,
      minion.TAUNT,
      onChange,
    ]
  );

  return (
    <div className={classes.root} onContextMenu={handleClick}>
      <img
        className={classes.portrait}
        src={getImageUrl(minion.cardId)}
        alt={minion.name}
      />
      <img
        className={classes.border}
        src={
          require(`@shared/assets/images/${
            minion.BACON_MINION_IS_LEVEL_TWO
              ? 'minion_border_gold'
              : 'minion_border'
          }.png`).default
        }
        alt="border"
      />
      {minion.TAUNT && (
        <img
          className={classes.taunt}
          src={
            require(`@shared/assets/images/${
              minion.BACON_MINION_IS_LEVEL_TWO ? 'taunt_gold' : 'taunt'
            }.png`).default
          }
          alt="taunt"
        />
      )}
      {minion.DEATHRATTLE && (
        <img
          className={classes.deathrattle}
          src={require('@shared/assets/images/deathrattle.png').default}
          alt="deathrattle"
        />
      )}
      {minion.POISONOUS && (
        <img
          className={classes.poisonous}
          src={require('@shared/assets/images/poisonous.png').default}
          alt="poisonous"
        />
      )}
      {checkLegend(minion) && (
        <img
          className={classes.legendary}
          src={
            require(`@shared/assets/images/${
              minion.BACON_MINION_IS_LEVEL_TWO ? 'legendary_gold' : 'legendary'
            }.png`).default
          }
          alt="legendary"
        />
      )}
      {minion.DIVINE_SHIELD && (
        <img
          className={classes.divineShield}
          src={require('@shared/assets/images/divine_shield.png').default}
          alt="divineShield"
        />
      )}

      <Text
        className={classes.atk}
        color={minion.ATK > (template?.attack ?? 0) ? '#00f300' : 'white'}
        suppressContentEditableWarning
        contentEditable={type === 'minions'}
        onBlur={(e: any) => {
          if (type === 'minions') {
            onChange?.({
              ATK: parseInt(e?.target?.textContent, 10) || minion.ATK,
            });
          }
        }}
      >
        {minion.ATK}
      </Text>
      <Text
        className={classes.health}
        color={minion.HEALTH > (template?.health ?? 0) ? '#00f300' : 'white'}
        suppressContentEditableWarning
        contentEditable={type === 'minions'}
        onBlur={(e: any) => {
          if (type === 'minions') {
            onChange?.({
              HEALTH: parseInt(e?.target?.textContent, 10) || minion.HEALTH,
            });
          }
        }}
      >
        {minion.HEALTH}
      </Text>

      {type === 'minions' && (
        <Menu
          keepMounted
          open={contextMenu.mouseY !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu.mouseY !== null && contextMenu.mouseX !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem onClick={() => handlePropsSetting('taunt')}>
            切换嘲讽状态
          </MenuItem>
          <MenuItem onClick={() => handlePropsSetting('divineShield')}>
            切换圣盾状态
          </MenuItem>
          <MenuItem onClick={() => handlePropsSetting('poisonous')}>
            切换剧毒状态
          </MenuItem>
        </Menu>
      )}
    </div>
  );
};

export default MinionComponent;
