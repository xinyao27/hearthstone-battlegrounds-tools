import { ipcRenderer } from 'electron';
import React, { ReactNode } from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline, Box } from '@material-ui/core';
import deepOrange from '@material-ui/core/colors/deepOrange';
import red from '@material-ui/core/colors/red';
import { useMount } from 'ahooks';

import { MAIN_SUSPENSION_MESSAGE } from '../../constants/topic';
import useStateFlow from '../hooks/useStateFlow';
import type { Filtered } from '../../logHandler/parser';

type Props = {
  children: ReactNode;
};

const JingDianLiBianJianFont = {
  fontFamily: 'JingDianLiBianJian',
  fontStyle: 'normal',
  src: `
    url(${
      require('../assets/fonts/JingDianLiBianJian.woff2').default
    }) format('woff2'),
    url(${
      require('../assets/fonts/JingDianLiBianJian.woff').default
    }) format('woff'),
    url(${require('../assets/fonts/JingDianLiBianJian.ttf').default})
  `,
};
const BelweBoldFont = {
  fontFamily: 'Belwe Bold',
  fontStyle: 'normal',
  src: `
    url(${require('../assets/fonts/Belwe-Bold.woff2').default}) format('woff2'),
    url(${require('../assets/fonts/Belwe-Bold.woff').default}) format('woff'),
    url(${require('../assets/fonts/Belwe-Bold.ttf').default})
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
        '@font-face': [JingDianLiBianJianFont, BelweBoldFont],
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

  const [, setStateFlow] = useStateFlow();

  useMount(() => {
    ipcRenderer.on(MAIN_SUSPENSION_MESSAGE, (_event, args: Filtered) => {
      setStateFlow(args);
    });
  });

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
