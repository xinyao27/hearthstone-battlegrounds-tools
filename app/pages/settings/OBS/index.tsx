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
  Tooltip,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import { useBoolean, useUpdateEffect } from 'ahooks';
import { useSnackbar } from 'notistack';
import { remote } from 'electron';

import useConnect from './useConnect';
import useObsText from './useObsText';
import useObsImage from './useObsImage';

const OBS: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { connect, disconnect, connected, error } = useConnect();
  const {
    enable: textEnable,
    setEnable: textSetEnable,
    sourcesList: textSourcesList,
    currentSource: textCurrentSource,
    setCurrentSource: textSetCurrentSource,
    max: textMax,
    setMax: textSetMax,
  } = useObsText();
  const {
    enable: imageEnable,
    setEnable: imageSetEnable,
    sourcesList: imageSourcesList,
    currentSource: imageCurrentSource,
    setCurrentSource: imageSetCurrentSource,
    dir: imageDir,
    setDir: imageSetDir,
    max: imageMax,
    setMax: imageSetMax,
  } = useObsImage();
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
  const handleChooseImageDir = React.useCallback(() => {
    remote.dialog
      .showOpenDialog({ properties: ['openDirectory'] })
      .then((result) => {
        if (!result.canceled && result.filePaths[0]) {
          imageSetDir(result.filePaths[0]);
        }
        return result;
      })
      .catch(console.log);
  }, [imageSetDir]);

  useUpdateEffect(() => {
    if (!connected) {
      setDrawerOpen(false);
    }
  }, [connected]);
  useUpdateEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  }, [error]);

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
                value={textCurrentSource}
                // @ts-ignore
                onChange={(e) => textSetCurrentSource(e.target.value)}
              >
                {textSourcesList.map((source) => (
                  <MenuItem key={source.name + source.type} value={source.name}>
                    {source.name}
                  </MenuItem>
                ))}
              </Select>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Tooltip
                title="这个选项表示在OBS中最多可展示的文本战绩数量"
                arrow
              >
                <span>战绩最大展示数</span>
              </Tooltip>
            </ListItemText>
            <ListItemSecondaryAction>
              <TextField
                style={{ width: 52 }}
                value={textMax}
                onChange={(e) => textSetMax(parseInt(e.target.value, 10))}
                type="number"
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListSubheader>输出图片</ListSubheader>
          <ListItem>
            <ListItemText>开启</ListItemText>
            <ListItemSecondaryAction>
              <Switch
                checked={imageEnable}
                onChange={(_, checked) => imageSetEnable(checked)}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>选择图片来源</ListItemText>
            <ListItemSecondaryAction>
              <Select
                value={imageCurrentSource}
                // @ts-ignore
                onChange={(e) => imageSetCurrentSource(e.target.value)}
              >
                {imageSourcesList.map((source) => (
                  <MenuItem key={source.name + source.type} value={source.name}>
                    {source.name}
                  </MenuItem>
                ))}
              </Select>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>选择图片储存路径</ListItemText>
            <ListItemSecondaryAction>
              <Tooltip title={imageDir} arrow>
                <IconButton onClick={handleChooseImageDir}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Tooltip
                title="这个选项表示在OBS中最多可展示的图片战绩数量"
                arrow
              >
                <span>战绩最大展示数</span>
              </Tooltip>
            </ListItemText>
            <ListItemSecondaryAction>
              <TextField
                style={{ width: 52 }}
                value={imageMax}
                onChange={(e) => imageSetMax(parseInt(e.target.value, 10))}
                type="number"
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default OBS;
