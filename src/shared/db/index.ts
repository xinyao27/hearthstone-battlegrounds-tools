import path from 'path'
import { remote } from 'electron'
import NEDBStore from 'nedb-promises'
import { RecordItem } from '@shared/hooks/useStatistics'

const recordsDBPath = path.join(
  remote.app.getPath('userData'),
  remote.app.getName(),
  'ne.db'
)
const recordsDB = NEDBStore.create({ filename: recordsDBPath, autoload: true })
export const records = {
  store: recordsDB,
  bulk(payload: RecordItem[]): Promise<RecordItem[]> {
    return this.store.insert(payload)
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  find(query: any): Promise<RecordItem[]> {
    return this.store.find<RecordItem>(query)
  },
  insert(payload: RecordItem): Promise<RecordItem> {
    return this.store.insert(payload)
  },
  remove(payload: RecordItem): Promise<number> {
    return this.store.remove({ _id: payload._id }, {})
  },
  update(payload: RecordItem): Promise<number> {
    return this.store.update({ _id: payload._id }, payload)
  },
  setUploaded(payload: RecordItem, synced: boolean): Promise<number> {
    return this.store.update({ _id: payload._id }, { $set: { synced } })
  },
}
