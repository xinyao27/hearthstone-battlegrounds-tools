import React, { ReactNode } from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline, Box } from '@material-ui/core';
import deepOrange from '@material-ui/core/colors/deepOrange';
import red from '@material-ui/core/colors/red';
import { SnackbarProvider } from 'notistack';
import { useMount, useUpdateEffect } from 'ahooks';
import { ipcRenderer } from 'electron';
import { useHistory } from 'react-router-dom';

import Header from '@app/components/Header';
import Navigation from '@app/components/Navigation';
import useRecord from '@app/hooks/useRecord';
import { SUSPENSION_MAIN_MESSAGE } from '@app/constants/topic';
import useInit from '@app/hooks/useInit';
import routes from '@app/constants/routes.json';

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
    ipcRenderer.on(
      SUSPENSION_MAIN_MESSAGE,
      (_event, args: { type: string; data: any }) => {
        if (args.type === 'addRecord') {
          addRecord(args.data);
        }
      }
    );
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
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
