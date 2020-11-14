import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  List as BaseList,
  TextField,
  Dialog,
  Slide,
  Zoom,
  Tooltip,
} from '@material-ui/core';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import StorefrontIcon from '@material-ui/icons/Storefront';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import type { TransitionProps } from '@material-ui/core/transitions';
import dayjs from 'dayjs';
import {
  useBoolean,
  useDocumentVisibility,
  useInViewport,
  useUpdateEffect,
} from 'ahooks';

import useRecord from '@app/hooks/useRecord';

import NewItem from './NewItem';
import Item from './Item';

const Transition = React.forwardRef(function Transition(
  // eslint-disable-next-line react/require-default-props
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<HTMLElement>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

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
  newItem: {
    position: 'absolute',
    bottom: theme.spacing(12),
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
  const [newItemIn, { toggle: newItemToggle }] = useBoolean(false);
  const [speedDialOpen, { toggle: speedDialOpenToggle }] = useBoolean(false);

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
      newItemToggle(false);
    },
    [addRecord, newItemToggle]
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

      <Zoom in>
        <SpeedDial
          className={classes.fab}
          open={speedDialOpen}
          onClose={() => speedDialOpenToggle(false)}
          onOpen={() => speedDialOpenToggle(true)}
          icon={
            <SpeedDialIcon
              icon={<StorefrontIcon />}
              openIcon={<SearchIcon />}
            />
          }
          ariaLabel="工具集"
        >
          <SpeedDialAction
            icon={<AddIcon />}
            title="手动添加战绩"
            tooltipTitle="手动添加战绩"
            onClick={() => newItemToggle(true)}
          />
        </SpeedDial>
      </Zoom>
      <Dialog
        TransitionComponent={Transition}
        open={newItemIn}
        onClose={() => newItemToggle(false)}
      >
        <Tooltip title="可以点击">
          <NewItem onSubmit={handleNewItem} />
        </Tooltip>
      </Dialog>
    </div>
  );
}
