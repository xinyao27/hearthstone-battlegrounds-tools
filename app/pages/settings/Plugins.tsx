import React from 'react';
import {
  Box,
  IconButton,
  Drawer,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  CircularProgress,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import { useBoolean } from 'ahooks';
import { remote } from 'electron';

import usePlugins from '@app/hooks/usePlugins';

import importPlugin, { HBTPlugin } from './importPlugin';
import { useEnv } from './createEnv';

const Plugins: React.FC = () => {
  useEnv();
  const [plugins, { add: addPlugin, remove: removePlugin }] = usePlugins();
  const [open, { toggle }] = useBoolean(false);
  const [loading, { toggle: toggleLoading }] = useBoolean(false);
  const [pluginModule, setPluginModule] = React.useState<HBTPlugin | null>(
    null
  );

  const handleInstallPlugin = React.useCallback(async () => {
    try {
      const { canceled, filePaths } = await remote.dialog.showOpenDialog({
        properties: ['openDirectory'],
      });
      if (!canceled) {
        const [path] = filePaths;
        addPlugin(path);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <IconButton onClick={() => toggle(true)}>
        <SettingsIcon />
      </IconButton>
      <Drawer
        style={{ width: 400 }}
        anchor="right"
        open={open}
        onClose={() => toggle(false)}
      >
        <Button onClick={handleInstallPlugin}>安装插件</Button>
        <Box width={400}>
          <List>
            {plugins?.map((plugin) => {
              async function handleClick() {
                toggleLoading(true);
                const module = await importPlugin(plugin.path, plugin.name);
                setPluginModule(module);
                toggleLoading(false);
              }
              return (
                <React.Fragment key={plugin.name}>
                  <ListItem button onClick={handleClick}>
                    <ListItemText>{plugin.name}</ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => removePlugin(plugin.name)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Dialog
                    id="dialog"
                    open={!!(pluginModule && pluginModule.name === plugin.name)}
                    onBackdropClick={() => {
                      setPluginModule(null);
                    }}
                  >
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      pluginModule?.Component &&
                      React.createElement(pluginModule.Component)
                    )}
                  </Dialog>
                </React.Fragment>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Plugins;
