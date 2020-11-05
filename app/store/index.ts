import Store from 'electron-store';

import type { RecordItem } from '@app/hooks/useStatistics';

interface Config {
  heartstoneRootPath?: string;
}

// 存储配置文件
export const config = {
  store: new Store<Config>({ name: 'config' }),
  get(key: keyof Config) {
    return this.store.get(key);
  },
  set(key: string, payload: any) {
    return this.store.set(key, payload);
  },
};

export const records = {
  store: new Store<{ data: RecordItem[] }>({ name: 'records' }),
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
