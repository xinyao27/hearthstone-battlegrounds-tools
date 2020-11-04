import React from 'react';
import { remote, ipcRenderer } from 'electron';
import { promises as fsPromises } from 'fs';
import { copy, remove } from 'fs-extra';
import path from 'path';
import { useMount } from 'ahooks';

interface HBTPlugin {
  name: string;
  Component: React.ElementType;
  mounted?: () => void;
  addedRecord?: (record: any) => void;
}
export interface Plugin extends HBTPlugin {
  path: string;
}

function usePlugins(): [
  Plugin[],
  { add: (filePath: string) => void; remove: (filePath: string) => void }
] {
  const [plugins, setPlugins] = React.useState<Plugin[]>([]);

  useMount(() => {
    setPlugins(() => remote.getGlobal('plugins'));
  });

  const handleAddPlugin = React.useCallback(async (pluginPath: string) => {
    const userDataPath = remote.app.getPath('userData');
    const pluginsPath = path.resolve(userDataPath, 'plugins');
    fsPromises.mkdir(pluginsPath).catch(console.log);
    const targetPath = path.resolve(pluginsPath, path.basename(pluginPath));
    await copy(pluginPath, targetPath);
    // eslint-disable-next-line promise/catch-or-return
    ipcRenderer.invoke('installPlugin', targetPath).then(() => {
      return setPlugins(() => remote.getGlobal('plugins'));
    });
  }, []);

  const handleRemovePlugin = React.useCallback((pluginName: string) => {
    const userDataPath = remote.app.getPath('userData');
    const pluginsPath = path.resolve(userDataPath, 'plugins');
    const pluginPath = path.resolve(pluginsPath, pluginName);
    remove(pluginPath);
    // eslint-disable-next-line promise/catch-or-return
    ipcRenderer.invoke('uninstallPlugin', pluginName).then(() => {
      return setPlugins(() => remote.getGlobal('plugins'));
    });
  }, []);

  return [plugins, { add: handleAddPlugin, remove: handleRemovePlugin }];
}

export default usePlugins;
