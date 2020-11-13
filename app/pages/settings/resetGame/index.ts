import { remote } from 'electron';
import path from 'path';
import { promises as fsPromises } from 'fs';

import template from './template';

const homePath = remote.app.getPath('home');
const hearthstonePath = path.resolve(
  homePath,
  `AppData\\Local\\Blizzard\\Hearthstone`
);
const logConfigPath = path.resolve(hearthstonePath, 'log.config');

async function resetGame() {
  return fsPromises.writeFile(logConfigPath, template, {
    encoding: 'utf8',
  });
}

export default resetGame;
