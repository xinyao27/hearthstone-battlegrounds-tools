import Store from 'electron-store';

import type { RecordItem } from '@app/hooks/useStatistics';

// 存储配置文件
export const config = {
  store: new Store({ name: 'config' }),
  get(key: string) {
    return this.store.get(key);
  },
  set(payload: any) {
    return this.store.set(payload);
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
