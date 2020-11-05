import React from 'react';
import fs from 'fs';
import path from 'path';
import { useMount } from 'ahooks';

export function useEnv() {
  useMount(async () => {
    // 为插件提供环境
    window.React = React;
    // @ts-ignore
    window.fs = fs;
    // @ts-ignore
    window.path = path;
  });
}
