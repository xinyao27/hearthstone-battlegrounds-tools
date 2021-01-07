import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Input,
  InputAdornment,
  IconButton,
  FormControl,
  Select,
  MenuItem,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

export interface SearchValue {
  query: string;
  techLevel: number;
  race: number;
}
interface SearchProps {
  onChange: (value: SearchValue) => void;
}

const raceMap = [
  {
    label: '任意种族',
    value: -1,
  },
  {
    label: '中立',
    value: 0,
  },
  {
    label: '所有种族',
    value: 26,
  },
  {
    label: '鱼人',
    value: 14,
  },
  {
    label: '恶魔',
    value: 15,
  },
  {
    label: '机械',
    value: 17,
  },
  {
    label: '元素',
    value: 18,
  },
  {
    label: '野兽',
    value: 20,
  },
  {
    label: '海盗',
    value: 23,
  },
  {
    label: '龙',
    value: 24,
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: '88%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: `0 auto ${theme.spacing(3)}px`,
  },
  right: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& > div': {
      marginRight: theme.spacing(2),
    },
  },
  techLevelItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  techLevelItemImg: {
    width: 18,
    height: 18,
  },
  techLevelItemText: {
    paddingLeft: theme.spacing(2),
  },
}));

const Search: React.FC<SearchProps> = ({ onChange }) => {
  const classes = useStyles();
  // 搜索关键词 可能是完整或部分的随从名称 也可能是部分的技能描述等
  const [query, setQuery] = React.useState<string>('');
  const [techLevel, setTier] = React.useState<number>(0);
  const [race, setRace] = React.useState<number>(-1);
  const handleQueryChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      onChange({
        query: e.target.value,
        techLevel,
        race,
      });
    },
    [onChange, race, techLevel]
  );
  const handleClearQuery = React.useCallback(() => {
    setQuery('');
    onChange({
      query: '',
      techLevel,
      race,
    });
  }, [onChange, race, techLevel]);

  const handleTierChange = React.useCallback(
    (e: React.ChangeEvent<{ value: unknown }>) => {
      const value = e.target.value as number;
      setTier(value);
      onChange({
        query,
        techLevel: value,
        race,
      });
    },
    [onChange, query, race]
  );

  const handleRaceChange = React.useCallback(
    (e: React.ChangeEvent<{ value: unknown }>) => {
      const value = e.target.value as number;
      setRace(value);
      onChange({
        query,
        techLevel,
        race: value,
      });
    },
    [onChange, query, techLevel]
  );

  return (
    <div className={classes.root}>
      <Input
        value={query}
        onChange={handleQueryChange}
        endAdornment={
          <InputAdornment position="end">
            {query && (
              <IconButton onClick={handleClearQuery} edge="end">
                <CloseIcon />
              </IconButton>
            )}
          </InputAdornment>
        }
        placeholder="搜索 (可搜索名称、效果等)"
      />

      <div className={classes.right}>
        <FormControl variant="outlined">
          <Select value={techLevel} onChange={handleTierChange}>
            {[0, 1, 2, 3, 4, 5, 6].map((item) => (
              <MenuItem key={item} value={item}>
                <div className={classes.techLevelItem}>
                  <div className={classes.techLevelItemImg}>
                    {item ? (
                      <img
                        src={
                          require(`@shared/assets/images/techLevel-${item}.png`)
                            .default
                        }
                        alt={`${item}星酒馆`}
                      />
                    ) : null}
                  </div>
                  <span className={classes.techLevelItemText}>
                    {item || '全部'}
                  </span>
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined">
          <Select value={race} onChange={handleRaceChange}>
            {raceMap.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default Search;
