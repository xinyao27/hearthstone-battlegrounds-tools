import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Drawer,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  Avatar,
  Button,
} from '@material-ui/core';
import { Minion } from '@hbt-org/core';
import { useCounter, useUpdateEffect } from 'ahooks';

import MinionComponent from '@core/components/Minion';
import { getImageUrl } from '@suspension/utils';
import Text from '@suspension/components/Text';
import useHeroes from '@shared/hooks/useHeroes';
import { RecordItem } from '@shared/hooks/useStatistics';

interface ReplayProps {
  open: boolean;
  onClose: () => void;
  data: RecordItem['history'];
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {},
    stepper: {
      width: 600,
      maxHeight: 'calc(100vh - 56px)',
      overflowX: 'hidden',
      overflowY: 'auto',
    },
    lineup: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '-24px 0',
      position: 'relative',
      '& > div': {
        display: 'inline-block',
        transform: 'scale(.6)',
        marginRight: -70,
      },
    },
    tag: {
      position: 'absolute',
      left: 0,
    },
    result: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sword: {
      width: 32,
      transform: 'rotate(-6deg)',
      marginLeft: theme.spacing(1),
      marginRight: -10,
    },
    blood: {
      position: 'relative',
      width: 60,
      marginRight: theme.spacing(1),
    },
    attackNum: {
      width: 22,
      display: 'flex',
      justifyContent: 'center',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'rotate(-22deg) translate(-32%, -73%)',
      '& > p': {
        display: 'inline-block',
      },
    },
    actions: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10px 0',
      '& > *': {
        margin: '0 5px',
      },
    },
  })
);

const Replay: React.FC<ReplayProps> = ({ open, onClose, data = [] }) => {
  const classes = useStyles();
  const { getHeroId, getHero } = useHeroes();
  const [current, { inc, dec }] = useCounter(0, {
    max: data.length - 1,
    min: 0,
  });

  useUpdateEffect(() => {
    const dom = document.querySelector(`#content-${current}`);
    dom?.scrollIntoView(false);
  }, [current]);

  return (
    <Drawer
      className={classes.root}
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Stepper
        className={classes.stepper}
        orientation="vertical"
        activeStep={current}
      >
        {data.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Step key={index}>
            <StepLabel StepIconProps={{ completed: false, icon: item.turn }}>
              回合
            </StepLabel>
            <StepContent id={`content-${index}`}>
              <div className={classes.result}>
                <Avatar
                  src={getImageUrl(
                    getHero(getHeroId(item.attacker))?.id ?? '',
                    'hero'
                  )}
                />
                <div className={classes.sword}>
                  <img
                    src={require('@shared/assets/images/sword.png').default}
                    alt="sword"
                  />
                </div>
                <div className={classes.blood}>
                  <img
                    src={
                      require('@shared/assets/images/blood_splat.png').default
                    }
                    alt="sword"
                  />
                  <div className={classes.attackNum}>
                    <Text isNumber>-</Text>
                    <Text>{item.attack}</Text>
                  </div>
                </div>

                <Avatar
                  src={getImageUrl(
                    getHero(getHeroId(item.defender))?.id ?? '',
                    'hero'
                  )}
                />
              </div>
              <div className={classes.lineup}>
                <Text className={classes.tag}>对方阵容</Text>
                {item?.lineup?.opponent?.map((minion) => (
                  <MinionComponent
                    minion={Minion.create(minion.id, minion.name, minion.props)}
                    type="store"
                    key={minion.id}
                  />
                ))}
              </div>
              <Divider />
              <div className={classes.lineup}>
                <Text className={classes.tag}>我方阵容</Text>
                {item?.lineup?.own?.map((minion) => (
                  <MinionComponent
                    minion={Minion.create(minion.id, minion.name, minion.props)}
                    type="store"
                    key={minion.id}
                  />
                ))}
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      <div className={classes.actions}>
        <Button
          disabled={current === 0}
          onClick={() => dec()}
          variant="contained"
          color="primary"
        >
          上一回合
        </Button>
        <Button
          disabled={current === data.length - 1}
          onClick={() => inc()}
          variant="contained"
          color="primary"
        >
          下一回合
        </Button>
      </div>
    </Drawer>
  );
};

export default Replay;
