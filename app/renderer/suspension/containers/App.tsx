import React, { ReactNode } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Box, CssBaseline } from '@material-ui/core';
import deepOrange from '@material-ui/core/colors/deepOrange';
import red from '@material-ui/core/colors/red';
import { useMount, useUpdateEffect } from 'ahooks';
import { useHistory } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';

import useStateFlow from '@suspension/hooks/useStateFlow';
import useBoxFlow from '@suspension/hooks/useBoxFlow';
import routes from '@suspension/constants/routes.json';
import { showSuspension } from '@suspension/utils';
import { getStore } from '@shared/store';
import { Topic } from '@shared/constants/topic';

type Props = {
  children: ReactNode;
};

const JianLiBianFont = {
  fontFamily: 'JianLiBian',
  fontStyle: 'normal',
  src: `
    url(${
      require('@shared/assets/fonts/JianLiBian.woff').default
    }) format('woff'),
    url(${
      require('@shared/assets/fonts/JianLiBian.woff2').default
    }) format('woff2'),
    url(${
      require('@shared/assets/fonts/JianLiBian.ttf').default
    }) format('truetype')
  `,
};
const BelweBoldFont = {
  fontFamily: 'Belwe Bold',
  fontStyle: 'normal',
  src: `
    url(${
      require('@shared/assets/fonts/Belwe-Bold.woff').default
    }) format('woff'),
    url(${
      require('@shared/assets/fonts/Belwe-Bold.woff2').default
    }) format('woff2'),
    url(${
      require('@shared/assets/fonts/Belwe-Bold.ttf').default
    }) format('woff2')
  `,
};
const theme = createMuiTheme({
  typography: {
    fontFamily: 'JianLiBian,Belwe Bold,Georgia,Times,Times New Roman,serif',
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [JianLiBianFont, BelweBoldFont],
        html: {
          height: '100%',
        },
        body: {
          height: '100%',
          overflow: 'hidden',
          background: 'none !important',
          userSelect: 'none',
        },
        '#root': {
          height: '100%',
          overflow: 'hidden',
        },
        img: {
          display: 'block',
          width: '100%',
        },
        '*': {
          cursor: `url("${
            require('@shared/assets/images/hand.png').default
          }") 0 0,auto`,
        },
        '*::-webkit-scrollbar': {
          display: 'none',
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

export default function App(props: Props) {
  const { children } = props;
  const history = useHistory();
  const [stateFlow, setStateFlow, resetStateFlow] = useStateFlow();
  const [boxFlow, setBoxFlow] = useBoxFlow();
  const [isBacon, setIsBacon] = React.useState<boolean | null>(null);

  useMount(() => {
    store.subscribe<Topic.FLOW>((action) => {
      const { type, payload } = action;
      if (type === Topic.FLOW) {
        if (payload.type === 'box') {
          setBoxFlow(payload);
        }
        if (payload.type === 'state') {
          setStateFlow(payload);
        }
      }
    });
  });
  useDeepCompareEffect(() => {
    // 选择酒馆时才启动 判断 null 时是容错处理 这样可以一定程度上防止在其他模式下启动
    if (isBacon === true || isBacon === null) {
      // state 收到开始 跳转至英雄选择页
      if (stateFlow?.current === 'GAME_START') {
        showSuspension();
        history.push(routes.HEROSELECTION);
      }
      // 容错处理，当前页面不再英雄选择页时跳转至英雄选择页
      if (stateFlow?.current === 'HERO_TOBE_CHOSEN') {
        // 仍然是容错处理，有时候 GAME_START 会检测不到
        showSuspension();
        if (history.location.pathname !== '/heroSelection') {
          history.push(routes.HEROSELECTION);
        }
      }
      // 切换对手信息
      if (stateFlow?.current === 'NEXT_OPPONENT') {
        history.push(routes.BATTLE);
      }
      // 对局结束 显示悬浮展示战绩
      if (stateFlow?.current === 'GAME_OVER') {
        history.push(routes.GAMEOVER);
      }
    }
  }, [stateFlow || {}, isBacon]);
  useUpdateEffect(() => {
    if (boxFlow?.current === 'BOX_GAME_START') {
      resetStateFlow();
    }
    if (boxFlow?.current === 'BOX_CHOOSE_BACON') {
      setIsBacon(true);
    }
  }, [boxFlow?.current]);

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
