import React from 'react';
import {
  Box,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Drawer,
  IconButton,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import { useBoolean } from 'ahooks';

import useConnect from './useConnect';
import useObsText from './useObsText';

const OBS: React.FC = () => {
  const { connect, disconnect, connected } = useConnect();
  const {
    enable: textEnable,
    setEnable: textSetEnable,
    sourcesList,
    currentSource,
    setCurrentSource,
  } = useObsText();
  const [dialogOpen, { toggle: setDialogOpen }] = useBoolean(false);
  const [drawerOpen, { toggle: setDrawerOpen }] = useBoolean(false);
  const [host, setHost] = React.useState('http://localhost:4444');
  const [password, setPassword] = React.useState('');
  const handleClickConnect = React.useCallback(() => {
    setDialogOpen(true);
  }, [setDialogOpen]);
  const handleDialogClose = React.useCallback(() => {
    setDialogOpen(false);
  }, [setDialogOpen]);
  const handleHostValueChange = React.useCallback((e) => {
    setHost(e.target.value);
  }, []);
  const handlePasswordValueChange = React.useCallback((e) => {
    setPassword(e.target.value);
  }, []);
  const handleConnect = React.useCallback(() => {
    connect(host, password);
    setDrawerOpen(true);
    handleDialogClose();
  }, [connect, handleDialogClose, host, password, setDrawerOpen]);

  return (
    <Box>
      <Button
        color="inherit"
        startIcon={connected ? <CloseIcon /> : <AddIcon />}
        onClick={connected ? disconnect : handleClickConnect}
      >
        {connected ? '关闭连接' : '连接OBS'}
      </Button>
      {connected && (
        <IconButton onClick={() => setDrawerOpen(true)}>
          <SettingsIcon />
        </IconButton>
      )}

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>连接OBS</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Host"
            fullWidth
            value={host}
            onChange={handleHostValueChange}
            placeholder="http://localhost:4444"
          />
          <TextField
            margin="dense"
            label="Password"
            fullWidth
            value={password}
            onChange={handlePasswordValueChange}
            placeholder="默认为空"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="default">
            取消
          </Button>
          <Button onClick={handleConnect} color="primary">
            连接
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        anchor="right"
      >
        <List style={{ width: 360 }}>
          <ListSubheader>输出文字</ListSubheader>
          <ListItem>
            <ListItemText>开启</ListItemText>
            <ListItemSecondaryAction>
              <Switch
                checked={textEnable}
                onChange={(_, checked) => textSetEnable(checked)}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>选择文本来源(GDI+)</ListItemText>
            <ListItemSecondaryAction>
              <Select
                value={currentSource}
                // @ts-ignore
                onChange={(e) => setCurrentSource(e.target.value)}
              >
                {sourcesList.map((source) => (
                  <MenuItem key={source.name + source.type} value={source.name}>
                    {source.name}
                  </MenuItem>
                ))}
              </Select>
            </ListItemSecondaryAction>
          </ListItem>

          <ListSubheader>输出图片</ListSubheader>
          <ListItem>
            <ListItemText>开启</ListItemText>
            <ListItemSecondaryAction>
              <Switch />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>选择图片来源</ListItemText>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default OBS;
