import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  List as BaseList,
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
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import type { TransitionProps } from '@material-ui/core/transitions';
import dayjs from 'dayjs';
import {
  useBoolean,
  useDocumentVisibility,
  useInViewport,
  useUpdateEffect,
} from 'ahooks';
import { remote } from 'electron';
import fs from 'fs';

import useRecord from '@core/hooks/useRecord';
import useStartHS from '@core/hooks/useStartHS';
import { records } from '@shared/store';

import NewItem from './NewItem';
import Item from './Item';
import DatePicker from './DatePicker';

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
  const { run } = useStartHS();
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

  const handleImportRecords = React.useCallback(() => {
    remote.dialog
      .showOpenDialog({ properties: ['openFile'] })
      .then((result) => {
        if (!result.canceled && result.filePaths[0]) {
          const targetPath = result.filePaths[0];
          const json = fs.readFileSync(targetPath, { encoding: 'utf8' });
          const data = JSON.parse(json);
          if (Array.isArray(data.data)) {
            records.bulk(
              data.data.map(
                (v: {
                  hero: any;
                  rank: any;
                  date: any;
                  remark: any;
                  lineup: any;
                }) => ({
                  hero: v.hero,
                  rank: v.rank,
                  date: dayjs(v.date).toDate(),
                  mark: v.remark,
                  lineup: v.lineup,
                })
              )
            );
          }
        }
        return result;
      })
      // eslint-disable-next-line no-console
      .catch(console.log);
  }, []);

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

  const [currentDate, setCurrentDate] = React.useState(dayjs());
  const listData = React.useMemo(() => {
    return recordList.filter((v) => dayjs(v.date).isSame(currentDate, 'day'));
  }, [recordList, currentDate]);

  return (
    <div className={classes.root} ref={rootRef}>
      <div className={classes.tools}>
        <DatePicker
          value={currentDate}
          onChange={setCurrentDate}
          data={recordList}
        />
      </div>
      <BaseList dense>
        {listData
          .sort((a, b) => (dayjs(a.date).isBefore(b.date) ? 1 : -1))
          .map((value) => {
            const selected = selectedItem === value._id;
            return (
              <Item
                key={value._id}
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
          <SpeedDialAction
            icon={<SystemUpdateAltIcon />}
            title="导入战绩"
            tooltipTitle="导入战绩"
            onClick={handleImportRecords}
          />
          <SpeedDialAction
            icon={<PlayArrowIcon />}
            title="启动炉石传说"
            tooltipTitle="启动炉石传说"
            onClick={run}
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
