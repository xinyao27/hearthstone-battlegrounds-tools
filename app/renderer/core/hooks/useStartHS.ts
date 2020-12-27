import React from 'react';
import { createModel } from 'hox';
import { exec as execBase } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { is } from 'electron-util';

import { config } from '@shared/store';

const exec = promisify(execBase);

const heartstoneRootPath = config.get('heartstoneRootPath') as string;
const heartstoneAppName = is.windows
  ? 'Hearthstone Beta Launcher.exe'
  : is.macos
  ? 'Hearthstone Beta Launcher.app'
  : '';
const heartstoneAppPath = path.join(heartstoneRootPath, heartstoneAppName);
const command = is.windows
  ? `start "" "${heartstoneAppPath}"`
  : is.macos
  ? `open "${heartstoneAppPath}"`
  : '';

function useStartHS() {
  const handleStartHS = React.useCallback(async () => {
    await exec(command);
  }, []);

  return {
    run: handleStartHS,
  };
}

export default createModel(useStartHS);
