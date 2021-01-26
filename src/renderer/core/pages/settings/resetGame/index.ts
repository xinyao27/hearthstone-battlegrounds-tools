import { remote } from 'electron'
import path from 'path'
import { promises as fsPromises } from 'fs'
import { is } from 'electron-util'

import template from './template'

const homePath = remote.app.getPath('home')
const hearthstonePath = path.resolve(
  homePath,
  is.windows
    ? `AppData\\Local\\Blizzard\\Hearthstone`
    : is.macos
    ? `Library/Preferences/Blizzard/Hearthstone`
    : ''
)
const logConfigPath = path.resolve(hearthstonePath, 'log.config')

async function resetGame(): Promise<void> {
  return fsPromises.writeFile(logConfigPath, template, {
    encoding: 'utf8',
  })
}

export default resetGame
