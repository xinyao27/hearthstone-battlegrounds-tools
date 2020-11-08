import React from 'react';
import Tour, { ReactourStep } from 'reactour';
import useInit from '@app/hooks/useInit';

const steps: ReactourStep[] = [
  {
    selector: '#heartstoneRootPathSetting',
    content: '需要设置你的《炉石传说》安装目录',
  },
  {
    selector: '#heartstoneRootPathSettingButton',
    content: '点击设置按钮选择《炉石传说》安装目录',
  },
];

const Intro: React.FC = () => {
  const [correctDirectory, { check }] = useInit();

  return (
    <Tour
      steps={steps}
      isOpen={!correctDirectory}
      closeWithMask={false}
      showCloseButton={false}
      accentColor="#ff5722"
      onRequestClose={check}
    />
  );
};

export default Intro;
