import React from 'react';
import { createModel } from 'hox';
import { useUpdateEffect } from 'ahooks';

import { config } from '@app/store';

import type { RequestMethodReturnMap } from './types';
import useCommand from './useCommand';
import useConnect from './useConnect';

function useObsImage() {
  const { run } = useCommand();
  const { connected } = useConnect();
  const [sourcesList, setSourcesList] = React.useState<
    RequestMethodReturnMap['GetSourcesList']['sources']
  >([]);
  const [enable, setEnable] = React.useState<boolean>(
    (config.get('obs.image.enable') as boolean) ?? false
  );
  const [currentSource, setCurrentSource] = React.useState<string>(() => {
    const configSource = config.get('obs.image.source') as string;
    if (sourcesList.find((v) => v.name === configSource)) {
      return configSource;
    }
    return '';
  });
  const [dir, setDir] = React.useState<string>(
    (config.get('obs.image.dir') as string) ?? ''
  );
  const [max, setMax] = React.useState<number>(
    (config.get('obs.image.max') as number) ?? 12
  );

  const handleEnable = React.useCallback(
    (result: boolean) => {
      setEnable((pre) => {
        if ((!currentSource || !dir) && !pre) {
          // eslint-disable-next-line no-alert
          alert('未设置图片来源或图片储存路径');
          return pre;
        }
        config.set('obs.image.enable', result);
        return result;
      });
    },
    [currentSource, dir]
  );
  const handleSetCurrentSource = React.useCallback((result: string) => {
    setCurrentSource(() => {
      config.set('obs.image.source', result);
      return result;
    });
  }, []);
  const handleSetDir = React.useCallback((result: string) => {
    setDir(() => {
      config.set('obs.image.dir', result);
      return result;
    });
  }, []);
  const handleSetMax = React.useCallback((result: number) => {
    setMax(() => {
      config.set('obs.image.max', result);
      return result;
    });
  }, []);

  useUpdateEffect(() => {
    async function getSourcesList() {
      const res = await run('GetSourcesList');
      if (res) {
        const filtered = res.sources.filter((v) => v.typeId === 'image_source');
        setSourcesList(filtered);
        const configSource = config.get('obs.image.source') as string;
        const hasConfig = filtered.find((v) => v.name === configSource);
        if (configSource && hasConfig) {
          setCurrentSource(configSource);
        }
        if (!hasConfig) {
          handleEnable(false);
        }
      }
    }
    if (connected) getSourcesList();
  }, [connected]);

  return {
    enable,
    setEnable: handleEnable,
    sourcesList,
    currentSource,
    setCurrentSource: handleSetCurrentSource,
    dir,
    setDir: handleSetDir,
    max,
    setMax: handleSetMax,
  };
}

export default createModel(useObsImage);
