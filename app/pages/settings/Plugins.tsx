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
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import { useBoolean } from 'ahooks';
import { remote, ipcRenderer } from 'electron';

import usePlugins from '@app/hooks/usePlugins';

const Plugins: React.FC = () => {
  const [plugins, { add: addPlugin, remove: removePlugin }] = usePlugins();
  const [open, { toggle }] = useBoolean(false);
  const [settingComponent, setSettingComponent] = React.useState<
    [string, boolean, string?] | []
  >([]);

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
      console.log(err);
    }
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
              return (
                <React.Fragment key={plugin.name}>
                  <ListItem
                    button
                    onClick={() => {
                      ipcRenderer
                        .invoke('getPluginComponent', plugin.name)
                        .then((html: string) => {
                          return setSettingComponent([plugin.name, true, html]);
                        })
                        .catch(console.log);
                    }}
                  >
                    <ListItemText>{plugin.name}</ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => removePlugin(plugin.name)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Dialog
                    id="dialog"
                    open={
                      !!(
                        settingComponent[0] === plugin.name &&
                        settingComponent[1]
                      )
                    }
                    onBackdropClick={() => {
                      setSettingComponent([]);
                    }}
                  >
                    <div
                      id="dialog_container"
                      dangerouslySetInnerHTML={{
                        __html: settingComponent[2] || '',
                      }}
                    />
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
