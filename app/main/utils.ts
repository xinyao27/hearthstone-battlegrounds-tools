import path from 'path';

export function getAppHTML(type?: 'suspension' | 'logHandler') {
  const typeString = type ? `?type=${type}` : '';

  return `file://${path.resolve(__dirname, '..')}/app.html${typeString}`;
}
