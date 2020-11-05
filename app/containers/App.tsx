import React, { ReactNode } from 'react';
import {
  ThemeProvider,
  createMuiTheme,
  makeStyles,
} from '@material-ui/core/styles';
import { CssBaseline, Box, Zoom, Tooltip, Fab } from '@material-ui/core';
import deepOrange from '@material-ui/core/colors/deepOrange';
import red from '@material-ui/core/colors/red';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import WorkIcon from '@material-ui/icons/Work';
import CallEndIcon from '@material-ui/icons/CallEnd';
import ErrorIcon from '@material-ui/icons/Error';
import 'fontsource-roboto';

import useWatchState from '@app/hooks/useWatchState';
import Header from '@app/components/Header';
// import Footer from '@app/components/Footer';
import Navigation from '@app/components/Navigation';

type Props = {
  children: ReactNode;
};

const muiTheme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          height: '100%',
        },
        body: {
          height: '100%',
          overflow: 'hidden',
        },
        '#root': {
          height: '100%',
          overflow: 'hidden',
        },
      },
    },
  },
  palette: {
    primary: {
      main: deepOrange[500],
    },
    secondary: {
      main: red[500],
    },
  },
});

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(9),
    right: theme.spacing(2),
  },
}));

export default function App({ children }: Props) {
  const classes = useStyles();
  const [watchState] = useWatchState();
  const watchStateIcon = React.useMemo(() => {
    switch (watchState.state) {
      case 'next':
        return {
          icon: <WorkIcon />,
          color: 'primary',
        };
      case 'complete':
        return {
          icon: <CallEndIcon />,
          color: 'default',
        };
      case 'error':
        return {
          icon: <ErrorIcon />,
          color: 'secondary',
        };
      default:
        return {
          icon: <WorkIcon />,
          color: 'primary',
        };
    }
  }, [watchState]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />

      <Box height="100%" display="flex" flexDirection="column">
        <Header />
        <Box flex={1} overflow="auto">
          {children}
        </Box>
        <Navigation />

        <Zoom
          in
          timeout={300}
          style={{
            transitionDelay: `300ms`,
          }}
          unmountOnExit
        >
          <Tooltip title={watchState.message}>
            <Fab className={classes.fab} color={watchStateIcon.color}>
              {watchStateIcon.icon}
            </Fab>
          </Tooltip>
        </Zoom>
      </Box>
    </ThemeProvider>
  );
}
