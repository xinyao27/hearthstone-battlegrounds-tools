import React from 'react';
import { Tooltip, IconButton } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import ErrorIcon from '@material-ui/icons/Error';

import useAuth from '@shared/hooks/useAuth';
import { getStore } from '@shared/store';
import { makeStyles } from '@material-ui/core/styles';
import { Topic } from '@shared/constants/topic';

const state = 'hbt';
const scope = 'openid';
const config = {
  url:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:23333/api'
      : 'https://hs.chenyueban.com/api',
  clientId: 'bbc02885c8c8477fb3430c773cad2139',
};
const redirectUri = encodeURIComponent(`${config.url}/auth/redirect`);
const url = `https://www.battlenet.com.cn/oauth/authorize?client_id=${config.clientId}&scope=${scope}&state=${state}&redirect_uri=${redirectUri}&response_type=code`;
const store = getStore();

const useStyles = makeStyles(() => ({
  button: {
    fontSize: 30,
  },
}));

const Login: React.FC = () => {
  const classes = useStyles();
  const { resetAuth, error } = useAuth();

  const handleLogin = React.useCallback(() => {
    store.dispatch<Topic.LOGIN>({
      type: Topic.LOGIN,
      payload: {
        url,
      },
    });
    resetAuth();
  }, [resetAuth]);

  return (
    <div>
      <Tooltip
        title={
          error ? (
            <div>{error.message}</div>
          ) : (
            <div>
              <div>战网登录</div>
              <div>登录后自动同步战绩</div>
            </div>
          )
        }
        placement="right"
        arrow
      >
        {error ? (
          <IconButton className={classes.button} color="inherit">
            <ErrorIcon fontSize="inherit" color="error" />
          </IconButton>
        ) : (
          <IconButton
            className={classes.button}
            onClick={handleLogin}
            color="inherit"
          >
            <PersonIcon fontSize="inherit" />
          </IconButton>
        )}
      </Tooltip>
    </div>
  );
};

export default Login;
