import React from 'react';
import { remote } from 'electron';
import { createModel } from 'hox';
import path from 'path';
import { promises as fsPromises, PathLike } from 'fs';
import { useMount } from 'ahooks';
import { is } from 'electron-util';
import template from './template';

const homePath = remote.app.getPath('home');
const hearthstonePath = path.resolve(
  homePath,
  is.windows
    ? `AppData\\Local\\Blizzard\\Hearthstone`
    : is.macos
    ? `Library/Preferences/Blizzard/Hearthstone`
    : ''
);
const optionsPath = path.resolve(hearthstonePath, 'options.txt');

async function readFile(filePath: PathLike) {
  try {
    const raw = await fsPromises.readFile(filePath, { encoding: 'utf8' });
    return raw.split('\n');
  } catch (err) {
    return [];
  }
}
function replace(map: string[], targetframerate: number, vsync: string) {
  if (map.find((v) => v.indexOf('targetframerate') > -1)) {
    const result = map.map((item) => {
      const [key] = item.split('=');
      if (key === 'targetframerate') {
        return `${key}=${targetframerate}`;
      }
      if (key === 'vsync') {
        return `${key}=${vsync}`;
      }
      return item;
    });
    return result.join('\n').trim();
  }
  const vsyncIndex = map.findIndex((v) => v.indexOf('vsync') > -1);
  if (vsyncIndex > -1) {
    map[vsyncIndex] = `vsync=${vsync}`;
  } else {
    map.push(`vsync=${vsync}`);
  }
  map.push(`targetframerate=${targetframerate}`);
  return map.join('\n').trim();
}
async function writeFile(
  filePath: PathLike,
  {
    targetframerate,
    vsync,
  }: {
    targetframerate: number;
    vsync: string;
  }
) {
  const map = await readFile(filePath);
  if (map.length) {
    const raw = replace(map, targetframerate, vsync);
    return fsPromises.writeFile(filePath, raw);
  }
  // 没有 options.txt 这个文件
  const templateMap = template.split('\n');
  const raw = replace(templateMap, targetframerate, vsync);
  return fsPromises.writeFile(filePath, raw, { encoding: 'utf8' });
}

export type Framerate = 60 | 144 | 240;

function useFPS(): [
  Framerate,
  {
    toggle: (targetframerate: Framerate) => void;
  }
] {
  const [framerate, setFramerate] = React.useState<Framerate>(60);

  useMount(async () => {
    const map = await readFile(optionsPath);
    const target = map.find((v) => v.indexOf('targetframerate') > -1);
    if (target) {
      const [, value] = target.split('=');
      setFramerate(parseInt(value, 10) as Framerate);
    }
  });

  const handleToggle = React.useCallback((targetframerate: Framerate) => {
    setFramerate(() => {
      const vsync = '0';
      writeFile(optionsPath, { targetframerate, vsync });
      return targetframerate;
    });
  }, []);

  return [framerate, { toggle: handleToggle }];
}

export default createModel(useFPS);
