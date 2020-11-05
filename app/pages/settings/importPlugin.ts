import fs from 'fs';
import path from 'path';
import React from 'react';

function isValidUrl(string: string) {
  return string.match(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/i);
}
function isValidDirectory(string: string) {
  return fs.lstatSync(string).isDirectory();
}

export interface HBTPlugin {
  name: string;
  Component: React.ElementType;
  mounted?: () => void;
  addedRecord?: (record: any) => void;
}

export default function importPlugin(target: string, name: string) {
  return new Promise<HBTPlugin>((resolve, reject) => {
    const script = document.createElement('script');
    if (isValidUrl(target)) {
      script.src = target;
    } else if (isValidDirectory(target)) {
      const pkg = JSON.parse(
        fs.readFileSync(path.resolve(target, 'package.json'), {
          encoding: 'utf8',
        })
      );
      const file = path.resolve(target, pkg.main);
      script.src = `file://${file}`;
    } else {
      reject(new Error('传入路径不合法'));
    }
    script.crossOrigin = 'anonymous';
    script.type = 'text/javascript';
    script.onload = () => {
      // @ts-ignore
      resolve(window[name]);
    };
    script.onerror = (error) => reject(error);
    document.head.appendChild(script);
  });
}
