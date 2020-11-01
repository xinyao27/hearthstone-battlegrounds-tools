import { ipcRenderer } from 'electron';
import React, { ReactNode } from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline, Box } from '@material-ui/core';
import deepOrange from '@material-ui/core/colors/deepOrange';
import red from '@material-ui/core/colors/red';

import { MAIN_SUSPENSION_MESSAGE } from '../../constants/topic';

type Props = {
  children: ReactNode;
};

const font = {
  fontFamily: 'JingDianLiBianJian',
  fontStyle: 'normal',
  src: `
    url(${
      require('../assets/fonts/JingDianLiBianJian.woff2').default
    }) format('woff2')
  `,
};
const theme = createMuiTheme({
  typography: {
    fontFamily:
      'JingDianLiBianJian,Belwe Bold,Georgia,Times,Times New Roman,serif',
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [font],
        html: {
          height: '100%',
        },
        body: {
          height: '100%',
          overflow: 'hidden',
          background: 'none !important',
          userSelect: 'none',
          cursor: `url("${
            require('../assets/images/hand.png').default
          }") 0 0,auto`,
        },
        '#root': {
          height: '100%',
          overflow: 'hidden',
        },
        img: {
          display: 'block',
          width: '100%',
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

export default function App(props: Props) {
  const { children } = props;

  React.useEffect(() => {
    ipcRenderer.on(MAIN_SUSPENSION_MESSAGE, (event, args) => {
      console.log(event, args);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box height="100%" display="flex" flexDirection="column">
        <Box flex={1} overflow="auto">
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
