import { EntityRecordPlugin, FinalEntitySchema, RecordSnapshot } from '@foscia/core/newModels/types';

export interface RecordSnapshotPlugin extends EntityRecordPlugin {
  __type: RecordSnapshotPluginType<this['__ctx']>;
}

export type RecordSnapshotPluginType<Schema> = Schema extends FinalEntitySchema
  ? {
    readonly $original: RecordSnapshot<Schema>;
  }
  : never;

export default function makeSnapshotPlugin() {
  return null as unknown as RecordSnapshotPlugin;
}
