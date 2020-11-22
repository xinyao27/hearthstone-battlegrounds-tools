import React, { ReactNode } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Box, CssBaseline } from '@material-ui/core';
import deepOrange from '@material-ui/core/colors/deepOrange';
import red from '@material-ui/core/colors/red';
import { useMount, useUpdateEffect } from 'ahooks';
import { useHistory } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { is } from 'electron-util';

import useStateFlow from '@suspension/hooks/useStateFlow';
import useBoxFlow from '@suspension/hooks/useBoxFlow';
import routes from '@suspension/constants/routes.json';
import { hideSuspension, showSuspension } from '@suspension/utils';
import { config, getStore } from '@shared/store';
import { Topic } from '@shared/constants/topic';

type Props = {
  children: ReactNode;
};

const JianLiBianFont = {
  fontFamily: 'JianLiBian',
  fontStyle: 'normal',
  src: `
    url(${
      require('@shared/assets/fonts/JianLiBian.woff2').default
    }) format('woff2'),
    url(${
      require('@shared/assets/fonts/JianLiBian.woff').default
    }) format('woff'),
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
      require('@shared/assets/fonts/Belwe-Bold.woff2').default
    }) format('woff2'),
    url(${
      require('@shared/assets/fonts/Belwe-Bold.woff').default
    }) format('woff'),
    url(${require('@shared/assets/fonts/Belwe-Bold.ttf').default})
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
  const [stateFlow, setStateFlow] = useStateFlow();
  const [boxFlow, setBoxFlow] = useBoxFlow();

  useMount(() => {
    store.subscribe<Topic.FLOW>((action) => {
      const { type, payload } = action;
      if (type === Topic.FLOW) {
        if (payload.type === 'box') {
          setBoxFlow(payload.source);
        }
        if (payload.type === 'state') {
          setStateFlow(payload.source);
        }
      }
    });
  });
  useDeepCompareEffect(() => {
    // state 收到开始 跳转至英雄选择页
    if (stateFlow?.current === 'GAME_START') {
      showSuspension();
      history.push(routes.HEROSELECTION);
    }
    // 容错处理，当前页面不再英雄选择页时跳转至英雄选择页
    if (stateFlow?.current === 'HERO_TOBE_CHOSEN') {
      if (history.location.pathname !== '/heroSelection') {
        showSuspension();
        history.push(routes.HEROSELECTION);
      }
    }
    // 英雄选择后 隐藏悬浮
    if (stateFlow?.current === 'HERO_CHOICES') {
      if (!is.development) {
        hideSuspension();
      }
    }
    // 切换对手信息
    if (stateFlow?.current === 'NEXT_OPPONENT') {
      history.push(routes.BATTLE);
    }
    // 对局结束 显示悬浮展示战绩
    if (stateFlow?.current === 'GAME_OVER') {
      // 当开启 enableGameResult 选项时展示对局结果，如果不做这层限制会导致最后决战时提前知晓排名，影响游戏体验
      if (config.get('enableGameResult') as boolean) {
        showSuspension();
      }
      history.push(routes.GAMEOVER);
    }
  }, [stateFlow || {}]);
  useUpdateEffect(() => {
    // 游戏结束 关闭悬浮
    if (boxFlow?.current === 'BOX_GAME_OVER') {
      if (stateFlow?.current === 'GAME_OVER' && stateFlow.GAME_OVER) {
        if (!is.development) {
          hideSuspension();
        }
      } else {
        history.push(routes.GAMEOVER);
        showSuspension();
      }
    }
  }, [boxFlow?.current, stateFlow?.current]);

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
