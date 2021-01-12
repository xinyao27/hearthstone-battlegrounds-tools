import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Tooltip,
  Typography,
  MenuItem,
  Divider,
  Avatar,
} from '@material-ui/core';

import useAuth from '@shared/hooks/useAuth';
import Login from './Login';

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    background: '#4f4f4f',
    cursor: 'pointer',
  },
  item: {
    fontSize: 14,
    '&:hover': {
      background: '#323945',
    },
  },
  profile: {
    color: '#7ec3e2',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    '&:hover': {
      background: 'none',
    },
  },
}));

const User: React.FC = () => {
  const classes = useStyles();
  const { hasAuth, user, resetAuth } = useAuth();

  const handleLogout = React.useCallback(() => {
    localStorage.removeItem('hbt_token');
    resetAuth();
  }, [resetAuth]);

  if (hasAuth) {
    return (
      <Tooltip
        title={
          <div>
            <MenuItem
              className={classes.profile}
              classes={{ root: classes.item }}
              style={{ cursor: 'default' }}
              dense={false}
            >
              <Typography>{user?.bnetTag}</Typography>
            </MenuItem>
            <Divider light />
            <MenuItem classes={{ root: classes.item }} onClick={handleLogout}>
              退出登录
            </MenuItem>
          </div>
        }
        placement="right"
        arrow
        interactive
      >
        <Avatar className={classes.small}>{user?.bnetTag?.[0]}</Avatar>
      </Tooltip>
    );
  }
  return <Login />;
};

export default User;
