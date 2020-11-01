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
import { v4 as uuid } from 'uuid';

import heroes from '../../constants/heroes.json';
import type { RecordItem } from '../../store/useStatistics';

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
  onSubmit: (item: RecordItem) => void;
}

const NewItem: React.FC<NewItemProps> = ({ onSubmit }) => {
  const classes = useStyles();

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
    if (hero) {
      onSubmit({
        id: uuid(),
        hero: {
          id: hero.id,
          name: hero.name,
        },
        rank,
        date,
      });
    }
  }, [onSubmit, currentItem, rank]);

  return (
    <Paper className={classes.root}>
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
              src={hero.battlegrounds.image}
              alt={hero.name}
            />
            <span>{hero.name}</span>
          </MenuItem>
        ))}
      </Select>

      <InputBase
        className={classes.input}
        value={rank}
        onChange={handleRankChange}
        placeholder="名次"
        type="number"
      />

      <IconButton color="primary" onClick={handleSubmit}>
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

export default NewItem;
