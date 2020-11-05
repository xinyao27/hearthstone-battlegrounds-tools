import React from 'react';
import { remote } from 'electron';
import { promises as fsPromises } from 'fs';
import { copy, remove } from 'fs-extra';
import path from 'path';
import { useMount } from 'ahooks';

import { plugins as pluginsStore, Plugin } from '@app/store';

function usePlugins(): [
  Plugin[],
  { add: (filePath: string) => void; remove: (filePath: string) => void }
] {
  const [plugins, setPlugins] = React.useState<Plugin[]>([]);

  useMount(() => {
    setPlugins(pluginsStore.get() ?? []);
  });

  const handleAddPlugin = React.useCallback(async (pluginPath: string) => {
    const userDataPath = remote.app.getPath('userData');
    // 插件将存储的 path
    const pluginsPath = path.resolve(userDataPath, 'plugins');
    // eslint-disable-next-line no-console
    fsPromises.mkdir(pluginsPath).catch(console.log);
    // 目标目录
    const targetPath = path.resolve(pluginsPath, path.basename(pluginPath));
    // 复制目录
    await copy(pluginPath, targetPath);
    const pkg = JSON.parse(
      await fsPromises.readFile(path.resolve(pluginPath, 'package.json'), {
        encoding: 'utf8',
      })
    );
    if (!pkg) {
      throw new Error('目标目录不是合法的插件目录');
    }
    setPlugins((prevState) => {
      const result = [...prevState, { name: pkg.name, path: targetPath }];
      pluginsStore.set(result);
      return result;
    });
  }, []);

  const handleRemovePlugin = React.useCallback((pluginName: string) => {
    const userDataPath = remote.app.getPath('userData');
    const pluginsPath = path.resolve(userDataPath, 'plugins');
    const pluginPath = path.resolve(pluginsPath, pluginName);
    remove(pluginPath);
    setPlugins((prevState) => {
      const result = prevState.filter((v) => v.name !== pluginName);
      pluginsStore.set(result);
      return result;
    });
  }, []);

  return [plugins, { add: handleAddPlugin, remove: handleRemovePlugin }];
}

export default usePlugins;
