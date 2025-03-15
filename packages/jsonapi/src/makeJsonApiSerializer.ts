import { isId, isRelation } from '@foscia/core';
import {
  JsonApiNewResource,
  JsonApiResourceIdentifier,
  JsonApiSerializerConfig,
} from '@foscia/jsonapi/types';
import {
  makeSerializer,
  makeSerializerRecordFactory,
  shouldSerialize,
} from '@foscia/serialization';
import { Arrayable, isNil } from '@foscia/shared';

const serializeId = (id: unknown) => (isNil(id) ? undefined : String(id));

/**
 * Make a JSON:API serializer object.
 *
 * @param config
 *
 * @category Factories
 */
export default <
  Record extends JsonApiNewResource = JsonApiNewResource,
  Related extends JsonApiResourceIdentifier = JsonApiResourceIdentifier,
  Data = { data: Arrayable<JsonApiNewResource> | null },
>(
  config?: Partial<JsonApiSerializerConfig<Record, Related, Data>>,
) => makeSerializer({
  createData: (records) => ({ data: records } as Data),
  createRecord: makeSerializerRecordFactory(
    (snapshot) => ({
      type: snapshot.$instance.$model.$type,
      attributes: {},
      relationships: {},
    } as Record),
    (record, { prop, key, value }) => {
      if (isId(prop)) {
        // eslint-disable-next-line no-param-reassign
        record[prop.key as 'id' | 'lid'] = serializeId(value);
      } else if (isRelation(prop)) {
        // eslint-disable-next-line no-param-reassign
        record.relationships![key] = { data: value as any };
      } else {
        // eslint-disable-next-line no-param-reassign
        record.attributes![key] = value;
      }
    },
  ),
  shouldSerialize: async (context) => (
    isId(context.prop)
    || await shouldSerialize(context)
  ),
  serializeRelation: (_, related) => ({
    type: related.$instance.$model.$type,
    id: serializeId(related.$values.id),
    lid: serializeId(related.$values.lid),
  }),
  serializeRelated: (_, related) => ({
    type: related.$instance.$model.$type,
    id: serializeId(related.$values.id),
  } as Related),
  ...config,
});
