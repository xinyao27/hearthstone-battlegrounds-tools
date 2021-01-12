import React from 'react';
import { useBoolean, useMount, useUpdateEffect } from 'ahooks';
import { createModel } from 'hox';

import { getUser, User } from '../api';

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
