import { isId } from '@foscia/core';
import isModelPrimary from '@foscia/core/models/definition/utilities/isModelPrimary';
import isModelRelation from '@foscia/core/models/definition/utilities/isModelRelation';
import { JsonApiDocument, JsonApiResourceIdentifier } from '@foscia/jsonapi/specification';
import {
  JsonApiRelationSerializerConfig,
  JsonApiSerializerConfig,
  JsonApiSerializerRecord,
} from '@foscia/jsonapi/types';
import { makeSnapshotsSerializer } from '@foscia/serialization';
import { isNil } from '@foscia/shared';

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
  PendingRecord extends Partial<JsonApiResourceIdentifier>,
  Record extends JsonApiResourceIdentifier,
>(
  config: Partial<JsonApiRelationSerializerConfig<Document, PendingRecord, Record>> = {},
) => makeSnapshotsSerializer<Document, PendingRecord, Record>({
  serializeData: (records) => ({ data: records } as Document),
  initializeRecord: (snapshot) => ({
    type: snapshot.instance.$model.$type,
  } satisfies JsonApiSerializerRecord as PendingRecord),
  hydrateRecord: (record, context) => {
    /* eslint-disable no-param-reassign */
    if (context.key === 'id' || context.key === 'lid') {
      record[context.key] = String(context.value);
    } else if (isModelRelation(context.prop)) {
      record.relationships = {
        ...record.relationships,
        [context.key]: {
          data: context.value,
        },
      };
    } else {
      record.attributes = {
        ...record.attributes,
        [context.key]: context.value,
      };
    }
  },
  serializeRelated: (context) => ({
    // TODO Call relation serializer.
  }),
  serialize: (context) => {
    if (isModelPrimary(context.prop)) {
      if (context.key === 'id' || context.key === 'lid') {
        if (context.value !== undefined && context.value !== null) {
          context.record[context.key] = String(context.value);

          return;
        }
      }
    }

    if ('attributes' in context.record && 'relationships' in context.record) {
      if (isModelRelation(context.prop)) {
        context.record.relationships[context.key] = {
          data: context.value,
        };
      } else {
        context.record.attributes[context.key] = context.value;
      }
    }
  },
  shouldSerializeOld: async (context) => (
    isId(context.prop)
    || await shouldSerialize(context)
  ),
  serializeRelationOld: (_, related) => ({
    type: related.$instance.$model.$type,
    id: serializeId(related.$values.id),
    lid: serializeId(related.$values.lid),
  }),
  serializeRelatedOld: (_, related) => ({
    type: related.$instance.$model.$type,
    id: serializeId(related.$values.id),
  } as Related),
  ...config,
});
