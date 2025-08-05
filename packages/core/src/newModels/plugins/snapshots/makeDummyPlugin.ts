import { EntityRecordPlugin, FinalEntitySchema } from '@foscia/core/newModels/types';

export interface RecordDummyPlugin extends EntityRecordPlugin {
  __type: RecordDummyPluginType<this['__ctx']>;
}

export type RecordDummyPluginType<Schema> = Schema extends FinalEntitySchema
  ? {
    readonly $dummy: 'dummy';
  }
  : never;

export default function makeDummyPlugin() {
  return null as unknown as RecordDummyPlugin;
}
