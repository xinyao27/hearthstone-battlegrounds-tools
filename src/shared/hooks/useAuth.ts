import React from 'react';
import { useBoolean, useMount, useUpdateEffect } from 'ahooks';
import { createModel } from 'hox';

import { getUser, User } from '@shared/api';
import { getStore } from '@shared/store';
import { Topic } from '@shared/constants/topic';

const store = getStore();
function useAuth() {
  const [hasAuth, { toggle: setHasAuth }] = useBoolean(false);
  const [user, setUser] = React.useState<User>();

  const resetAuth = React.useCallback(() => {
    const token = localStorage.getItem('hbt_token');
    setHasAuth(!!token);
  }, [setHasAuth]);

  useMount(() => {
    const token = localStorage.getItem('hbt_token');
    setHasAuth(!!token);
  });

  useUpdateEffect(() => {
    (async () => {
      if (hasAuth) {
        const data = await getUser();
        if (data) {
          setUser(data);
          store.dispatch<Topic.SET_USER>({
            type: Topic.SET_USER,
            payload: data,
          });
        }
      }
    })();
  }, [hasAuth]);

  return {
    hasAuth,
    resetAuth,
    user,
  };
}

export default createModel(useAuth);
