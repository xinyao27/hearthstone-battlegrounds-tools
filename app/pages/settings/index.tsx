import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from '@material-ui/core';
import { remote } from 'electron';
import { useMount } from 'ahooks';

import { config } from '@app/store';

import getList from './list';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    minWidth: 120,
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

  useMount(() => {
    const result = config.get('heartstoneRootPath');
    console.log(remote.app.getPath('userData'), result);
  });

  const list = getList();

  return (
    <div className={classes.root}>
      <List
        subheader={<ListSubheader>Settings</ListSubheader>}
        className={classes.root}
      >
        {list.map((item) => (
          <ListItem key={item.label}>
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
    </div>
  );
}
