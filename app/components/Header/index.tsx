import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import useConnect from '@app/hooks/useConnect';
import useObsText from '@app/hooks/useObsText';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
  },
}));

export default function Header() {
  const classes = useStyles();
  const { connect, disconnect, connected } = useConnect();
  const { sourcesList, currentSource, setCurrentSource } = useObsText();

  const [open, setOpen] = React.useState(false);
  const [host, setHost] = React.useState('http://localhost:4444');
  const [password, setPassword] = React.useState('');
  const handleClickConnect = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleHostValueChange = React.useCallback((e) => {
    setHost(e.target.value);
  }, []);
  const handlePasswordValueChange = React.useCallback((e) => {
    setPassword(e.target.value);
  }, []);
  const handleConnect = React.useCallback(() => {
    connect(host, password);
    handleClose();
  }, [connect, host, password]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <img
            src="https://static.hsreplay.net/static/images/battlegrounds/icons/heroes.svg"
            alt="icons"
          />
          <Typography variant="h6" className={classes.title}>
            酒馆战棋战绩统计
          </Typography>
          <Box>
            <Button
              color="inherit"
              startIcon={<AddIcon />}
              onClick={connected ? disconnect : handleClickConnect}
            >
              {connected ? '关闭连接' : '连接OBS'}
            </Button>

            {connected && (
              <>
                <span>选择文本来源(GDI+)</span>
                <Select
                  value={currentSource}
                  // @ts-ignore
                  onChange={(e) => setCurrentSource(e.target.value)}
                >
                  {sourcesList.map((source) => (
                    <MenuItem
                      key={source.name + source.type}
                      value={source.name}
                    >
                      {source.name}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog open={open} onClose={handleClose}>
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
          <Button onClick={handleClose} color="default">
            取消
          </Button>
          <Button onClick={handleConnect} color="primary">
            连接
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
