import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List as BaseList, TextField } from '@material-ui/core';
import { is } from 'electron-util';
import dayjs from 'dayjs';
import { useDocumentVisibility, useInViewport, useUpdateEffect } from 'ahooks';

import useRecord from '@app/hooks/useRecord';

import NewItem from './NewItem';
import Item from './Item';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  tools: {
    padding: theme.spacing(2),
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

  const [
    recordList,
    { addRecord, deleteRecord, editRecord, refresh },
  ] = useRecord();
  const [selectedItem, setSelectedItem] = React.useState<string>();
  const rootRef = React.useRef<HTMLDivElement>(null);

  const documentVisibility = useDocumentVisibility();
  const inViewPort = useInViewport(rootRef);
  useUpdateEffect(() => {
    if (documentVisibility === 'visible' && inViewPort) {
      refresh();
    }
  }, [inViewPort, documentVisibility]);

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
  const handleEditItem = React.useCallback(
    (item) => {
      editRecord(item);
    },
    [editRecord]
  );
  const handleItemClick = React.useCallback((id: string) => {
    setSelectedItem(id);
  }, []);

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
    <div className={classes.root} ref={rootRef}>
      <div className={classes.tools}>
        {is.development && <NewItem onSubmit={handleNewItem} />}

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
            const selected = selectedItem === value.id;
            return (
              <Item
                key={value.id}
                value={value}
                selected={selected}
                onClick={handleItemClick}
                onDelete={handleDeleteItem}
                onChange={handleEditItem}
              />
            );
          })}
      </BaseList>
    </div>
  );
}
