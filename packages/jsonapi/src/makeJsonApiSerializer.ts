import { isAttributeDef, ModelIdType } from '@foscia/core';
import {
  JsonApiNewResource,
  JsonApiResourceIdentifier,
  JsonApiSerializerConfig,
} from '@foscia/jsonapi/types';
import { makeSerializer, makeSerializerRecordFactory } from '@foscia/serialization';
import { Arrayable, isNil, Optional } from '@foscia/shared';

const serializeId = (id: Optional<ModelIdType>) => (isNil(id) ? undefined : String(id));

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
      id: serializeId(snapshot.$values.id),
      lid: serializeId(snapshot.$values.lid),
      attributes: {},
      relationships: {},
    } as Record),
    (record, { def, key, value }) => {
      if (isAttributeDef(def)) {
        // eslint-disable-next-line no-param-reassign
        record.attributes![key] = value;
      } else {
        // eslint-disable-next-line no-param-reassign
        record.relationships![key] = { data: value as any };
      }
    },
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
