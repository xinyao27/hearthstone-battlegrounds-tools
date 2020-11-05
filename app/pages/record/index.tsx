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
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import dayjs from 'dayjs';

import heroes from '@app/constants/heroes.json';
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

  const [recordList, { addRecord, deleteRecord }] = useRecord();
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
    </div>
  );
}
