import { isAttributeDef, ModelIdType } from '@foscia/core';
import {
  JsonApiNewResource,
  JsonApiResourceIdentifier,
  JsonApiSerializerConfig,
} from '@foscia/jsonapi/types';
import { makeSerializerRecordFactory, makeSerializerWith } from '@foscia/serialization';
import { Arrayable, isNil, Optional } from '@foscia/shared';

export default function makeJsonApiSerializer<
  Record extends JsonApiNewResource = JsonApiNewResource,
  Related extends JsonApiResourceIdentifier = JsonApiResourceIdentifier,
  Data = { data: Arrayable<JsonApiNewResource> | null },
>(config?: Partial<JsonApiSerializerConfig<Record, Related, Data>>) {
  const serializeId = (id: Optional<ModelIdType>) => (isNil(id) ? undefined : String(id));

  return {
    serializer: makeSerializerWith({
      serializeRelation: (_, related) => ({
        type: related.$model.$type,
        id: serializeId(related.id),
        lid: serializeId(related.lid),
      }),
      serializeRelated: (_, related) => ({
        type: related.$model.$type,
        id: serializeId(related.id),
      } as Related),
      createData: (records) => ({ data: records } as Data),
      createRecord: makeSerializerRecordFactory(
        (instance) => ({
          type: instance.$model.$type,
          id: serializeId(instance.id),
          lid: serializeId(instance.lid),
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
      ...config,
    }),
  };
}
