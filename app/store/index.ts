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

export interface Plugin {
  name: string;
  path: string;
}
// 存储插件配置
export const plugins = {
  store: new Store<{ data: Plugin[] }>({ name: 'plugins' }),
  get() {
    return this.store.get('data');
  },
  set(payload: Plugin[]) {
    return this.store.set('data', payload);
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
