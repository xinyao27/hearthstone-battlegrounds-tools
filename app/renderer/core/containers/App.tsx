import React, { ReactNode } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Box, CssBaseline } from '@material-ui/core';
import deepOrange from '@material-ui/core/colors/deepOrange';
import red from '@material-ui/core/colors/red';
import { SnackbarProvider } from 'notistack';
import { useMount, useUpdateEffect } from 'ahooks';
import { useHistory } from 'react-router-dom';

import Header from '@core/components/Header';
import Navigation from '@core/components/Navigation';
import useRecord from '@core/hooks/useRecord';
import useInit from '@core/hooks/useInit';
import routes from '@core/constants/routes.json';
import { getStore } from '@shared/store';
import { Topic } from '@shared/constants/topic';

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
        img: {
          width: '100%',
          display: 'block',
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

const store = getStore();

export default function App({ children }: Props) {
  const history = useHistory();
  const [, { addRecord }] = useRecord();
  const [correctDirectory] = useInit();

  useUpdateEffect(() => {
    // 不正确 进入设置页面开始引导
    if (!correctDirectory) {
      history.push(routes.SETTINGS);
    }
  }, [correctDirectory, history]);

  useMount(() => {
    store.subscribe<Topic.ADD_RECORD>((action) => {
      if (action.type === Topic.ADD_RECORD) {
        addRecord(action.payload);
      }
    });
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={1}>
        <Box height="100%" display="flex" flexDirection="column">
          <Header />
          <Box flex={1} overflow="auto">
            {children}
          </Box>
          <Navigation />
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
