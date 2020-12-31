import React from 'react';
// @ts-ignore
import Emoji233333 from 'emoji-233333';

const list = [
  {
    label: 'hbt',
    url: 'https://hs.chenyueban.com/hearthstone/images/surprise/logo.png',
  },
  {
    label: 'HBT',
    url: 'https://hs.chenyueban.com/hearthstone/images/surprise/logo.png',
  },
  {
    label: '雪之下雪乃',
    url:
      'https://hs.chenyueban.com/hearthstone/images/surprise/surprise-01.jpg',
  },
];

const options = {
  // DOM / 选择器
  base: 'emoji', // string | HTMLElement
  // 表情缩放程度
  scale: 0.3, // number
  // 动画速度
  speed: 3, // number
  // 递增速度
  increaseSpeed: 0.3, // number
  // 表情密度
  density: 3, // number
  // 是否启用内置缓存机制
  cache: true, // boolean
  // 是否启用交错效果
  staggered: Math.random() > 0.5, // boolean
  // 自定义表情图片地址 url || base64
  emoji: 'https://hs.chenyueban.com/hearthstone/images/surprise/logo.png', // string
};

function useSurprise() {
  const handleLaunch = React.useCallback((value: string) => {
    list.forEach((item) => {
      if (value?.includes(item.label)) {
        const canvas =
          document.querySelector('#emoji') ?? document.createElement('canvas');
        canvas.id = 'emoji';
        canvas.setAttribute(
          'style',
          `position: fixed;top: 0;left: 0;z-index: -1;`
        );
        canvas.setAttribute('width', window.innerWidth.toString());
        canvas.setAttribute('height', window.innerHeight.toString());
        const root = document.querySelector('#root');
        root?.appendChild(canvas);
        // @ts-ignore
        options.base = canvas;
        options.emoji = item.url;
        const emoji233333 = new Emoji233333(options);
        emoji233333.launch();
      }
    });
  }, []);

  return {
    run: handleLaunch,
  };
}

export default useSurprise;
