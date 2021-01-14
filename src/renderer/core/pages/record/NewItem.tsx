import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Select,
  MenuItem,
  InputBase,
  IconButton,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { useSnackbar } from 'notistack';
import clsx from 'clsx';

import type { RecordItem } from '@shared/hooks/useStatistics';
import { getImageUrl } from '@suspension/utils';
import useHeroes from '@shared/hooks/useHeroes';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
  },
  img: {
    width: 40,
    marginRight: theme.spacing(1),
  },
}));

interface NewItemProps {
  className?: string;
  onSubmit: (item: RecordItem) => void;
}

const NewItem = React.forwardRef<HTMLElement, NewItemProps>(
  ({ className, onSubmit }, ref) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { heroes } = useHeroes();

    const [currentItem, setCurrentItem] = React.useState(() => heroes[0].id);
    const [rank, setRank] = React.useState('');
    const handleItemChange = React.useCallback((e) => {
      setCurrentItem(e.target.value);
    }, []);
    const handleRankChange = React.useCallback((e) => {
      setRank(e.target.value);
    }, []);
    const handleSubmit = React.useCallback(() => {
      const hero = heroes.find((h) => h.id === currentItem);
      const date = new Date();
      if (!rank) {
        enqueueSnackbar('请填写排名', { variant: 'warning' });
        return;
      }
      if (hero) {
        // @ts-ignore
        onSubmit({
          hero: {
            id: hero.dbfId,
            name: hero.name,
          },
          rank,
          date,
        });
      }
    }, [heroes, rank, currentItem, enqueueSnackbar, onSubmit]);

    return (
      <Paper className={clsx(classes.root, className)} ref={ref}>
        <Select
          classes={{
            root: classes.item,
          }}
          value={currentItem}
          onChange={handleItemChange}
        >
          {heroes.map((hero) => (
            <MenuItem className={classes.item} key={hero.id} value={hero.id}>
              <img
                className={classes.img}
                src={getImageUrl(hero.id, 'hero')}
                alt={hero.name}
              />
              <span>{hero.name}</span>
            </MenuItem>
          ))}
        </Select>

        <InputBase
          className={classes.input}
          value={rank}
          required
          onChange={handleRankChange}
          type="number"
        />

        <IconButton color="primary" onClick={handleSubmit}>
          <SendIcon />
        </IconButton>
      </Paper>
    );
  }
);
NewItem.displayName = 'NewItem';

export default NewItem;
