import isModelPrimary from '@foscia/core/models/definition/utilities/isModelPrimary';
import isModelRelation from '@foscia/core/models/definition/utilities/isModelRelation';
import isSameSnapshot from '@foscia/core/models/snapshots/isSameSnapshot';
import { RestSerializerRecord } from '@foscia/rest/types';
import { makeSnapshotsSerializer, SnapshotsSerializerConfig } from '@foscia/serialization';
import { Arrayable, mapArrayable } from '@foscia/shared';

/**
 * Make a REST serializer object.
 *
 * @param config
 *
 * @category Factories
 * @since 0.13.0
 */
export default <
  PendingRecord extends RestSerializerRecord,
  Record extends RestSerializerRecord,
  Document = Arrayable<RestSerializerRecord> | null,
>(
  config?: Partial<SnapshotsSerializerConfig<Document, PendingRecord, Record>>,
) => makeSnapshotsSerializer<Document, PendingRecord, Record>({
  serializeData: ({ records }) => ({
    data: records,
  } satisfies Arrayable<RestSerializerRecord> | null as Document),
  createRecord: ({ snapshot }) => {
    const record: RestSerializerRecord = {};

    // TODO If type.

    return record as PendingRecord;
  },
  serializeValue: async ({ snapshot, record, prop, key, value }, serialize) => {
    if (
      value !== undefined
      && (
        isModelPrimary(prop)
        || !isSameSnapshot(snapshot, snapshot.original ?? null, [prop.key])
      )
    ) {
      /* eslint-disable no-param-reassign */
      if (isModelRelation(prop)) {
        record[key] = await mapArrayable(value, async (related) => serialize(related as any));
      } else {
        record[key] = value;
      }
    }
  },
  ...config,
});
