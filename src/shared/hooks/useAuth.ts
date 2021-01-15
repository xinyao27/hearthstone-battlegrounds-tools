import React from 'react';
import { useBoolean, useMount, useUpdateEffect } from 'ahooks';
import { createModel } from 'hox';

import { getUser, User } from '@shared/api';
import { getStore } from '@shared/store';
import { Topic } from '@shared/constants/topic';

const store = getStore();
function useAuth() {
  const [hasAuth, { toggle: setHasAuth }] = useBoolean(false);
  const [hasToken, { toggle: setHasToken }] = useBoolean(false);
  const [error, setError] = React.useState<Error>();
  const [user, setUser] = React.useState<User>();

  const resetAuth = React.useCallback(() => {
    const token = localStorage.getItem('hbt_token');
    if (!token) {
      setUser(undefined);
      setHasAuth(false);
    }
    setHasToken(!!token);
  }, [setHasAuth, setHasToken]);

  useMount(() => {
    const token = localStorage.getItem('hbt_token');
    setHasToken(!!token);
  });

  useUpdateEffect(() => {
    (async () => {
      try {
        if (hasToken) {
          const data = await getUser();
          if (data) {
            setUser(data);
            setHasAuth(!!data);
            store.dispatch<Topic.SET_USER>({
              type: Topic.SET_USER,
              payload: data,
            });
          } else {
            throw new Error('获取用户信息失败');
          }
        }
      } catch (e) {
        setError(e);
        setTimeout(() => {
          localStorage.removeItem('hbt_token');
          resetAuth();
          setError(undefined);
        }, 3000);
      }
    })();
  }, [hasToken]);

  return {
    hasAuth,
    resetAuth,
    user,
    error,
  };
}

export default createModel(useAuth);
