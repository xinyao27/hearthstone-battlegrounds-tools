import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  List as BaseList,
  Dialog,
  Slide,
  Zoom,
  Tooltip,
  Chip,
  Avatar,
} from '@material-ui/core'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import StorefrontIcon from '@material-ui/icons/Storefront'
import SearchIcon from '@material-ui/icons/Search'
import AddIcon from '@material-ui/icons/Add'
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt'
import CloudQueueIcon from '@material-ui/icons/CloudQueue'
import type { TransitionProps } from '@material-ui/core/transitions'
import dayjs from 'dayjs'
import {
  useBoolean,
  useDebounceFn,
  useDocumentVisibility,
  useInViewport,
  useUpdateEffect,
} from 'ahooks'
import { remote } from 'electron'
import fs from 'fs'
import { is } from 'electron-util'
import { useSnackbar } from 'notistack'

import useRecord from '@shared/hooks/useRecord'
import useDayRecord from '@core/hooks/useDayRecord'
import useSynchronousRecords from '@shared/hooks/useSynchronousRecords'
import { records } from '@shared/db'
import { getImageUrl } from '@suspension/utils'

import NewItem from './NewItem'
import Item from './Item'
import DatePicker from './DatePicker'

const Transition = React.forwardRef(function Transition(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<HTMLElement>
) {
  return <Slide direction="left" ref={ref} {...props} />
})

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
    bottom: theme.spacing(4),
    right: theme.spacing(3),
  },
  newItem: {
    position: 'absolute',
    bottom: theme.spacing(12),
    right: theme.spacing(2),
  },
}))

const Record: React.FC = () => {
  const classes = useStyles()

  const { sync } = useSynchronousRecords()
  const { enqueueSnackbar } = useSnackbar()
  const [
    recordList,
    { addRecord, deleteRecord, editRecord, refresh },
  ] = useRecord()
  const [selectedItem, setSelectedItem] = React.useState<string>()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [newItemIn, { toggle: newItemToggle }] = useBoolean(false)
  const [speedDialOpen, { toggle: speedDialOpenToggle }] = useBoolean(false)

  const documentVisibility = useDocumentVisibility()
  const inViewPort = useInViewport(rootRef)
  useUpdateEffect(() => {
    if (documentVisibility === 'visible' && inViewPort) {
      refresh()
    }
  }, [inViewPort, documentVisibility])

  const handleImportRecords = React.useCallback(() => {
    remote.dialog
      .showOpenDialog({ properties: ['openFile'] })
      .then((result) => {
        if (!result.canceled && result.filePaths[0]) {
          const targetPath = result.filePaths[0]
          const json = fs.readFileSync(targetPath, { encoding: 'utf8' })
          const data = JSON.parse(json)
          if (Array.isArray(data.data)) {
            records.bulk(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data.data.map((v: any) => ({
                hero: v.hero,
                rank: v.rank,
                date: dayjs(v.date).toDate(),
                mark: v.remark,
                lineup: v.lineup,
              }))
            )
          }
        }
        return result
      })
      // eslint-disable-next-line no-console
      .catch(console.log)
  }, [])
  const { run: handleSync } = useDebounceFn(
    () => {
      sync()
        .then((res) => {
          if (res) {
            return enqueueSnackbar('战绩同步成功', {
              variant: 'success',
            })
          }
          return true
        })
        .catch(() => {
          enqueueSnackbar('战绩同步失败，请稍后重试', {
            variant: 'error',
          })
        })
    },
    { wait: 300 }
  )

  const handleNewItem = React.useCallback(
    (item) => {
      addRecord(item)
      newItemToggle(false)
    },
    [addRecord, newItemToggle]
  )
  const handleDeleteItem = React.useCallback(
    (item) => {
      deleteRecord(item)
    },
    [deleteRecord]
  )
  const handleEditItem = React.useCallback(
    (item) => {
      editRecord(item)
    },
    [editRecord]
  )
  const handleItemClick = React.useCallback((id: string) => {
    setSelectedItem(id)
  }, [])

  const [currentDate, setCurrentDate] = React.useState(dayjs())
  const { data: listData, best } = useDayRecord(currentDate)

  return (
    <div className={classes.root} ref={rootRef}>
      <div className={classes.tools}>
        <DatePicker
          value={currentDate}
          onChange={setCurrentDate}
          data={recordList}
        />

        {best && (
          <Tooltip
            title={
              <div>
                <div>平均排名：{best.averageRanking}</div>
                <div>使用场次：{best.count}</div>
              </div>
            }
            arrow
          >
            <Chip
              avatar={
                <Avatar
                  src={getImageUrl(best.avatar, 'hero')}
                  alt={best.name}
                />
              }
              label="今日最佳"
              clickable
            />
          </Tooltip>
        )}
      </div>
      <BaseList dense>
        {listData
          .sort((a, b) => (dayjs(a.date).isBefore(b.date) ? 1 : -1))
          .map((value) => {
            const selected = selectedItem === value._id
            return (
              <Item
                key={value._id}
                value={value}
                selected={selected}
                onClick={handleItemClick}
                onDelete={handleDeleteItem}
                onChange={handleEditItem}
              />
            )
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
          {is.development && (
            <SpeedDialAction
              icon={<AddIcon />}
              title="手动添加战绩"
              tooltipTitle="手动添加战绩"
              onClick={() => newItemToggle(true)}
            />
          )}
          {is.development && (
            <SpeedDialAction
              icon={<SystemUpdateAltIcon />}
              title="导入战绩"
              tooltipTitle="导入战绩"
              onClick={handleImportRecords}
            />
          )}
          <SpeedDialAction
            icon={<CloudQueueIcon />}
            title="手动同步战绩"
            tooltipTitle="手动同步战绩"
            onClick={handleSync}
          />
        </SpeedDial>
      </Zoom>
      <Dialog
        TransitionComponent={Transition}
        open={newItemIn}
        onClose={() => newItemToggle(false)}
      >
        <NewItem onSubmit={handleNewItem} />
      </Dialog>
    </div>
  )
}

export default Record
