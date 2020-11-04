import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  List as BaseList,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Zoom,
  Fab,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import dayjs from 'dayjs';

import heroes from '@app/constants/heroes.json';
import useConnect from '@app/hooks/useConnect';
import useCommand from '@app/hooks/useCommand';
import useObsText from '@app/hooks/useObsText';
import useRecord from '@app/hooks/useRecord';

import NewItem from './NewItem';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  tools: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(9),
    right: theme.spacing(2),
  },
}));

export default function Record() {
  const classes = useStyles();
  const { connected } = useConnect();
  const { run } = useCommand();
  const { currentSource } = useObsText();

  const [recordList, { addRecord, deleteRecord }] = useRecord((result) => {
    if (connected) {
      (async () => {
        // 只取当天的数据
        const today = dayjs();
        const todayResult = result.filter((v) =>
          dayjs(v.date).isSame(today, 'day')
        );
        const text = todayResult
          .map((v) => `${v.hero.name} ${v.rank}`)
          .join('\n');
        await run('SetTextGDIPlusProperties', {
          source: currentSource,
          text,
        });
      })();
    }
  });
  const handleNewItem = React.useCallback(
    (item) => {
      addRecord(item);
    },
    [addRecord]
  );
  const handleDeleteItem = React.useCallback(
    (item) => {
      deleteRecord(item);
    },
    [deleteRecord]
  );

  const [currentDate, setCurrentDate] = React.useState(
    dayjs().format('YYYY-MM-DD')
  );
  const handleDateChange = React.useCallback((e) => {
    setCurrentDate(e.target.value);
  }, []);
  const listData = React.useMemo(() => {
    return recordList.filter((v) => dayjs(v.date).isSame(currentDate, 'day'));
  }, [recordList, currentDate]);

  return (
    <div className={classes.root}>
      <div className={classes.tools}>
        <NewItem onSubmit={handleNewItem} />

        <TextField
          label="选择日期"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={currentDate}
          onChange={handleDateChange}
        />
      </div>

      <BaseList dense>
        {listData
          .sort((a, b) => (dayjs(a.date).isBefore(b.date) ? 1 : -1))
          .map((value) => {
            const currentHero = heroes.find((h) => h.id === value.hero.id);
            return (
              <ListItem key={value.id} button>
                <ListItemAvatar>
                  <Avatar
                    src={currentHero?.battlegrounds.image}
                    alt={currentHero?.name}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={value.rank}
                  secondary={dayjs(value.date).format('YYYY-MM-DD hh:mm:ss')}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => {
                      handleDeleteItem(value);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
      </BaseList>

      <Zoom
        in
        timeout={300}
        style={{
          transitionDelay: `${0}ms`,
        }}
        unmountOnExit
      >
        <Fab
          className={classes.fab}
          color="primary"
          href="https://github.com/chenyueban/obs-hearthstone"
          target="_blank"
        >
          <HelpOutlineIcon />
        </Fab>
      </Zoom>
    </div>
  );
}
