import { app } from 'electron';
import path from 'path';

export function getAppHTML(type?: 'suspension' | 'logHandler') {
  const typeString = type ? `?type=${type}` : '';

  return `file://${path.resolve(__dirname, '..')}/app.html${typeString}`;
}

export const getAssetPath = (...paths: string[]): string => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../../resources');
  return path.join(RESOURCES_PATH, ...paths);
};
