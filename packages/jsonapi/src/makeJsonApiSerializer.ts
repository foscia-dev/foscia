import isModelPrimary from '@foscia/core/models/definition/utilities/isModelPrimary';
import isModelRelation from '@foscia/core/models/definition/utilities/isModelRelation';
import isSameSnapshot from '@foscia/core/models/snapshots/isSameSnapshot';
import toShallowSnapshot from '@foscia/core/models/snapshots/toShallowSnapshot';
import serializeProp from '@foscia/core/props/internals/serializeProp';
import { JsonApiDocument } from '@foscia/jsonapi/specification';
import { JsonApiSerializerRecord } from '@foscia/jsonapi/types';
import { makeSnapshotsSerializer, SnapshotsSerializerConfig } from '@foscia/serialization';
import { isNil, mapArrayable } from '@foscia/shared';

const serializeId = (id: unknown) => (isNil(id) ? undefined : String(id));

/**
 * Make a JSON:API serializer object.
 *
 * @param config
 *
 * @category Factories
 */
export default <
  Document extends JsonApiDocument<Record>,
  PendingRecord extends JsonApiSerializerRecord,
  Record extends JsonApiSerializerRecord,
>(
  config?: Partial<SnapshotsSerializerConfig<Document, PendingRecord, Record>>,
) => makeSnapshotsSerializer<Document, PendingRecord, Record>({
  serializeData: ({ records }) => ({
    data: records,
  } satisfies JsonApiDocument<Record> as Document),
  createRecord: ({ snapshot }) => ({
    type: snapshot.instance.$model.$type,
  } satisfies JsonApiSerializerRecord as PendingRecord),
  serializeValue: async ({ snapshot, record, prop, key, value }, serialize) => {
    if (
      value !== undefined
      && (
        isModelPrimary(prop)
        || !isSameSnapshot(snapshot, snapshot.original ?? null, [prop.key])
      )
    ) {
      /* eslint-disable no-param-reassign */
      if (key === 'lid' || key === 'id') {
        record[key] = String(await serializeProp(prop, value));
      } else if (isModelRelation(prop)) {
        record.relationships = {
          ...record.relationships,
          [key]: {
            data: await mapArrayable(value, async (related) => {
              const resource = await serialize(toShallowSnapshot(related as any));
              if (!resource.id) {
                throw new Error('TODO');
              }

              return {
                type: resource.type,
                id: resource.id,
                lid: resource.lid,
              };
            }),
          },
        };
      } else {
        record.attributes = {
          ...record.attributes,
          [key]: await serializeProp(prop, value),
        };
      }
    }
  },
  ...config,
});
