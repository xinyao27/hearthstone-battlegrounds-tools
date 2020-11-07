import Store from 'electron-store';

import type { RecordItem } from '@app/hooks/useStatistics';
import type { RequestMethodReturnMap } from '@app/pages/settings/OBS/types';

interface Config {
  heartstoneRootPath?: string;
  obs: {
    text: {
      enable?: boolean;
      source?: RequestMethodReturnMap['GetSourcesList']['sources'][0];
      max: number;
    };
    image: {
      enable?: boolean;
      source?: RequestMethodReturnMap['GetSourcesList']['sources'][0];
      dir?: string;
      max: number;
    };
  };
}

// 存储配置文件
export const config = {
  store: new Store<Config>({
    name: 'config',
    defaults: {
      obs: {
        image: {
          max: 12,
        },
        text: {
          max: 12,
        },
      },
    },
  }),
  get(key: keyof Config | string) {
    return this.store.get(key);
  },
  set(key: string, payload: any) {
    return this.store.set(key, payload);
  },
};

export const records = {
  store: new Store<{ data: RecordItem[] }>({
    name: 'records',
    defaults: { data: [] },
  }),
  get() {
    return this.store.get('data');
  },
  set(payload: RecordItem[]) {
    return this.store.set('data', payload);
  },
};

export default {
  config,
  records,
};
