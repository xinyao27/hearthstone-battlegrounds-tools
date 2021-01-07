import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grow, Tooltip } from '@material-ui/core';

import type { IHero } from '@hbt-org/core';

import HeroData from '@suspension/components/HeroData';
import { getImageUrl } from '@suspension/utils';
import useHeroes from '@shared/hooks/useHeroes';

interface HeroCardProps {
  heroId: number;
  displayData?: boolean;
  mini?: boolean;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(4),
  },
  title: {
    position: 'relative',
    minHeight: 110,
  },
  avatar: {
    position: 'absolute',
    left: 0,
    top: (props: HeroCardProps) => (props.mini ? 28 : 12),
    width: (props: HeroCardProps) => (props.mini ? 60 : 80),
    zIndex: 2,
  },
  nameBar: {
    position: 'relative',
    top: 56,
    height: 22,
    zIndex: 1,
    backgroundColor: '#dbb991',
    margin: '0 -27px',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -6,
      width: '100%',
      height: 4,
      backgroundColor: '#dbb991',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -6,
      width: '100%',
      height: 4,
      backgroundColor: '#dbb991',
    },
  },
  name: {
    position: 'absolute',
    left: 86,
    bottom: 28,
    zIndex: 2,
    width: 124,
    fontSize: 20,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

const HeroCard: React.FC<HeroCardProps> = (props) => {
  const { heroes } = useHeroes();
  const { heroId, displayData } = props;
  const classes = useStyles(props);

  const hero = React.useMemo<IHero | undefined>(
    () => heroes.find((v) => v.dbfId === heroId),
    [heroId, heroes]
  );

  if (hero) {
    return (
      <Grow in={!!hero} style={{ transformOrigin: '0 0 0' }} timeout={300}>
        <div
          className={classes.root}
          style={!displayData ? { marginBottom: 0 } : {}}
        >
          <div className={classes.title}>
            <div className={classes.avatar}>
              <img src={getImageUrl(hero.id, 'hero')} alt={hero.name} />
            </div>
            <div className={classes.nameBar} />
            <Tooltip title={hero.name} arrow placement="top">
              <div className={classes.name}>{hero.name}</div>
            </Tooltip>
          </div>

          {displayData ? <HeroData id={heroId} /> : null}
        </div>
      </Grow>
    );
  }

  return null;
};

HeroCard.defaultProps = {
  displayData: true,
  mini: false,
};

export default HeroCard;
