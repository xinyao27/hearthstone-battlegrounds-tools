import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Modal,
  Slide,
  Paper,
  Typography,
  IconButton,
  Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { shell } from 'electron';

interface AboutProps {
  open: boolean;
  onClose: () => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 375,
    maxWidth: 600,
    width: '80%',
    margin: '26% auto 0',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // alignItems: 'center',
    position: 'relative',
  },
  close: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
  },
  header: {},
  name: {},
  version: {
    marginLeft: theme.spacing(2),
  },
  content: {
    flex: 1,
    minHeight: 200,
    paddingTop: theme.spacing(4),
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copyright: {},
  buttons: {
    '& > *': {
      marginRight: theme.spacing(2),
    },
  },
}));

const { version } = require('@src/package.json');

const About: React.FC<AboutProps> = ({ open, onClose }) => {
  const classes = useStyles();

  const versions = React.useMemo(() => {
    const { electron, chrome, node, v8 } = process.versions;
    return [
      { type: 'electron', value: electron },
      { type: 'chrome', value: chrome },
      { type: 'node', value: node },
      { type: 'v8', value: v8 },
    ];
  }, []);

  const handleToLicense = React.useCallback(() => {
    shell.openExternal(
      'https://github.com/hbt-org/hearthstone-battlegrounds-tools/blob/main/LICENSE'
    );
  }, []);
  const handleToReleases = React.useCallback(() => {
    shell.openExternal(
      'https://github.com/hbt-org/hearthstone-battlegrounds-tools/releases'
    );
  }, []);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      disableAutoFocus
    >
      <Slide in={open}>
        <Paper className={classes.root}>
          <IconButton className={classes.close} size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>

          <header className={classes.header}>
            <Typography
              className={classes.name}
              id="modal-title"
              display="inline"
              variant="h4"
            >
              HBT
            </Typography>
            <Typography className={classes.version} display="inline">
              Version {version}
            </Typography>
          </header>

          <div className={classes.content}>
            {versions.map((item) => (
              <Typography
                key={item.type}
                variant="body2"
                color="textSecondary"
                gutterBottom
              >
                {item.type}: {item.value}
              </Typography>
            ))}
          </div>

          <footer className={classes.footer}>
            <Typography
              className={classes.copyright}
              variant="body2"
              color="textSecondary"
            >
              Copyright (c) 2020 陈月半
            </Typography>

            <div className={classes.buttons}>
              <Button onClick={handleToLicense} color="primary">
                开源许可
              </Button>
              <Button onClick={handleToReleases} color="primary">
                更新日志
              </Button>
            </div>
          </footer>
        </Paper>
      </Slide>
    </Modal>
  );
};

export default About;
