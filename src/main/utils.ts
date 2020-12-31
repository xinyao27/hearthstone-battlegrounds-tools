import { app } from 'electron';
import path from 'path';

export function getAppHTML(type?: 'suspension' | 'logHandler') {
  const typeString = type ? `?type=${type}` : '';

  return `file://${path.resolve(__dirname, '..')}/index.html${typeString}`;
}

export const getAssetPath = (...paths: string[]): string => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');
  return path.join(RESOURCES_PATH, ...paths);
};
