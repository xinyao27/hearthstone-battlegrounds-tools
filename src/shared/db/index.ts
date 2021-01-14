import path from 'path';
import { remote } from 'electron';
import NEDBStore from 'nedb-promises';
import { RecordItem } from '@shared/hooks/useStatistics';

const recordsDBPath = path.join(
  remote.app.getPath('userData'),
  remote.app.getName(),
  'ne.db'
);
const recordsDB = NEDBStore.create({ filename: recordsDBPath, autoload: true });
export const records = {
  store: recordsDB,
  bulk(payload: RecordItem[]) {
    return this.store.insert(payload);
  },
  find(query: any): Promise<RecordItem[]> {
    // @ts-ignore
    return this.store.find<RecordItem>(query);
  },
  insert(payload: RecordItem) {
    return this.store.insert(payload);
  },
  remove(payload: RecordItem) {
    return this.store.remove({ _id: payload._id }, {});
  },
  update(payload: RecordItem) {
    return this.store.update({ _id: payload._id }, payload);
  },
  setUploaded(payload: RecordItem, synced: boolean) {
    return this.store.update({ _id: payload._id }, { $set: { synced } });
  },
};
