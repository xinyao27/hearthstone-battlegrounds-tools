import fs from 'fs'
import path from 'path'

import type { State, BoxState, Feature } from '../features'
import { stateFeatures } from '../features'

export function getLog(state: State | BoxState): string[] | null {
  const dirPath = path.resolve(__dirname, 'logs', state)
  const dir = fs.readdirSync(dirPath)
  if (Array.isArray(dir)) {
    return dir.map((fileName) => {
      const filePath = path.join(dirPath, fileName)
      return fs.readFileSync(filePath, { encoding: 'utf-8' })
    })
  }

  return null
}

export function getStateFeature(state: State): Feature<State> | undefined {
  return stateFeatures.find((v) => v.state === state)
}
