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
