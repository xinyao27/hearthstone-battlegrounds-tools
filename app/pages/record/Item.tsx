import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Typography,
  Grow,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import dayjs from 'dayjs';
import { useUpdateEffect } from 'ahooks';

import heroes from '@app/constants/heroes.json';
import type { RecordItem } from '@app/hooks/useStatistics';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 65,
  },
  content: {
    flex: 1,
    margin: `6px 0`,
  },
  rank: {},
  date: {
    marginLeft: theme.spacing(2),
  },
}));

interface ItemProps {
  value: RecordItem;
  selected: boolean;
  onClick: (id: string) => void;
  onDelete: (value: RecordItem) => void;
  onChange: (value: RecordItem) => void;
}

const Item: React.FC<ItemProps> = ({
  value,
  selected,
  onClick,
  onDelete,
  onChange,
}) => {
  const classes = useStyles();
  const inputRef = React.useRef<HTMLInputElement>();

  const handleRemarkChange = React.useCallback(
    (e) => {
      onChange({ ...value, remark: e.target.value });
    },
    [onChange, value]
  );
  const currentHero = React.useMemo(
    () => heroes.find((h) => h.id === value.hero.id),
    [value]
  );

  useUpdateEffect(() => {
    if (selected) {
      inputRef.current?.focus();
    }
  }, [selected]);

  return (
    <ListItem
      className={classes.root}
      button
      selected={selected}
      onClick={() => onClick(value.id)}
    >
      <ListItemAvatar>
        <Avatar
          src={currentHero?.battlegrounds.image}
          alt={currentHero?.name}
        />
      </ListItemAvatar>
      <div className={classes.content}>
        <div>
          <Typography className={classes.rank} display="inline">
            {value.rank}
          </Typography>
          <Typography
            className={classes.date}
            variant="caption"
            color="textSecondary"
            display="inline"
          >
            {dayjs(value.date).format('YYYY-MM-DD hh:mm:ss')}
          </Typography>
        </div>
        {selected ? (
          <Grow in={selected}>
            <TextField
              value={value.remark ?? ''}
              onChange={handleRemarkChange}
              inputRef={inputRef}
              size="small"
              placeholder="在这里输入备注"
            />
          </Grow>
        ) : value.remark ? (
          <Typography variant="caption" color="textSecondary">
            {value.remark}
          </Typography>
        ) : null}
      </div>
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => {
            onDelete(value);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default Item;
