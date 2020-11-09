import React from 'react';
import { createModel } from 'hox';
import { useBoolean, useMount } from 'ahooks';
import { promises as fsPromises } from 'fs';

import { config } from '@app/store';

function useInit(): [boolean, { check: () => Promise<boolean> }] {
  const [correctDirectory, { toggle: setCorrectDirectory }] = useBoolean(true);

  const check = React.useCallback(async () => {
    try {
      // 检测默认炉石路径是否正确
      const heartstoneRootPath = config.get('heartstoneRootPath') as string;
      const stats = await fsPromises.stat(heartstoneRootPath);
      const items = stats.isDirectory()
        ? (await fsPromises.readdir(heartstoneRootPath)) || []
        : [];
      const result = items.some(
        (item) =>
          item === 'Hearthstone.exe' || item === 'Hearthstone Beta Launcher.exe'
      );
      setCorrectDirectory(result);
      return result;
    } catch (_) {
      setCorrectDirectory(false);
      return false;
    }
  }, [setCorrectDirectory]);

  useMount(() => {
    check();
  });

  return [correctDirectory, { check }];
}

export default createModel(useInit);
