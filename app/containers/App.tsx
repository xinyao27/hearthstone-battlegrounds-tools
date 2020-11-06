import React, { ReactNode } from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline, Box } from '@material-ui/core';
import deepOrange from '@material-ui/core/colors/deepOrange';
import red from '@material-ui/core/colors/red';
import 'fontsource-roboto';

import Header from '@app/components/Header';
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

export default function App({ children }: Props) {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />

      <Box height="100%" display="flex" flexDirection="column">
        <Header />
        <Box flex={1} overflow="auto">
          {children}
        </Box>
        <Navigation />
      </Box>
    </ThemeProvider>
  );
}
