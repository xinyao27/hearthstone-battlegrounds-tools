import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Typography,
  Grow,
  Tooltip,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import dayjs from 'dayjs';
import { useUpdateEffect } from 'ahooks';

import type { RecordItem } from '@core/hooks/useStatistics';
import MinionCard from '@suspension/components/MinionCard';
import { getImageUrl } from '@suspension/utils';
import useHeroes from '@shared/hooks/useHeroes';
import useSurprise from '@core/hooks/useSurprise';

const MinionTooltip = withStyles(() => ({
  tooltip: {
    background: 'none',
  },
}))(Tooltip);

const useStyles = makeStyles((theme) => ({
  combatPower: {
    marginBottom: theme.spacing(1),
  },
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
  const { heroes } = useHeroes();
  const { run: surprise } = useSurprise();

  const handleRemarkChange = React.useCallback(
    (e) => {
      onChange({ ...value, remark: e.target.value });
    },
    [onChange, value]
  );
  const currentHero = React.useMemo(
    () => heroes.find((h) => h.id === value.hero.id),
    [heroes, value]
  );

  useUpdateEffect(() => {
    if (selected) {
      surprise(value?.remark ?? '');
      inputRef.current?.focus();
    }
  }, [selected, value]);

  return (
    <MinionTooltip
      title={
        Array.isArray(value?.lineup?.minions) ? (
          <div>
            {value?.lineup?.minions?.map((minion: any) => (
              <MinionCard
                minionName={minion.name}
                props={minion.props}
                key={minion.id}
              />
            ))}
          </div>
        ) : (
          ''
        )
      }
    >
      <ListItem
        className={classes.root}
        button
        selected={selected}
        onClick={() => onClick(value._id)}
      >
        <ListItemAvatar>
          <Avatar
            src={getImageUrl(currentHero?.image ?? '')}
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
              {dayjs(value.date).format('YYYY-MM-DD HH:mm:ss')}
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
    </MinionTooltip>
  );
};

export default Item;
