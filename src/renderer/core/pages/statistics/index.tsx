import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Collapse,
  Box,
  IconButton,
  Avatar,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import dayjs from 'dayjs';
import { useInViewport, useUpdateEffect } from 'ahooks';

import useStatistics, { ResultItem } from '@core/hooks/useStatistics';
import useRecord from '@core/hooks/useRecord';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
  },
});
interface RowProps {
  row: ResultItem;
}
const Row: React.FC<RowProps> = ({ row }) => {
  const classes = useRowStyles();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <div className={classes.hero}>
            <Avatar
              src={row.heroAvatar}
              alt={row.heroName}
              style={{ marginRight: 6 }}
            />
            <span>{row.heroName}</span>
          </div>
        </TableCell>
        <TableCell align="right">{row.ranks.length}</TableCell>
        <TableCell align="right">{row.averageRanking}</TableCell>
        <TableCell align="right">
          {(row.selectRate * 100).toFixed(2)}%
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>日期</TableCell>
                    <TableCell>排名</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.ranks.map((rankRow) => (
                    <TableRow key={rankRow.date}>
                      <TableCell component="th" scope="row">
                        {dayjs(rankRow.date).format('YYYY-MM-DD HH:mm:ss')}
                      </TableCell>
                      <TableCell>{rankRow.rank}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default function Statistics() {
  const [recordList, { refresh }] = useRecord();
  const result = useStatistics(recordList);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const inViewPort = useInViewport(rootRef);
  useUpdateEffect(() => {
    if (inViewPort) {
      refresh();
    }
  }, [inViewPort]);

  return (
    <TableContainer component={Paper} ref={rootRef}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>英雄</TableCell>
            <TableCell align="right">选择次数</TableCell>
            <TableCell align="right">平均排名</TableCell>
            <TableCell align="right">选择率</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {result?.map((row) => (
            <Row key={row.heroId} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
