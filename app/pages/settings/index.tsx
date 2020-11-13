import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { useBoolean } from 'ahooks';

import About from '@app/components/About';

import getList from './list';
import Intro from './Intro';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 375,
  },
  tools: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(9),
    right: theme.spacing(2),
  },
}));

export default function Settings() {
  const classes = useStyles();

  const [aboutOpen, { toggle: toggleAboutOpen }] = useBoolean(false);

  const list = getList();

  return (
    <div className={classes.root}>
      <Intro />
      <List subheader={<ListSubheader>Settings</ListSubheader>}>
        {list.map((item) => (
          <ListItem id={item.id} key={item.label}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
            <ListItemSecondaryAction>
              {typeof item.action === 'function'
                ? // @ts-ignore
                  React.createElement(item.action)
                : item.action}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <About open={aboutOpen} onClose={() => toggleAboutOpen(false)} />
      <List subheader={<ListSubheader>About</ListSubheader>}>
        <ListItem button onClick={() => toggleAboutOpen(true)}>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="关于" />
        </ListItem>
      </List>
    </div>
  );
}
