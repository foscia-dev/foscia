import { DeserializedData, isRelation } from '@foscia/core';
import { RestDeserializerConfig, RestNewResource } from '@foscia/rest/types';
import {
  DeserializerExtract,
  makeDeserializer,
  makeDeserializerRecordFactory,
} from '@foscia/serialization';
import { Arrayable, mapArrayable } from '@foscia/shared';

/**
 * Make a REST deserializer object.
 *
 * @param config
 *
 * @category Factories
 * @since 0.13.0
 */
export default <
  Record extends RestNewResource = RestNewResource,
  Data = Arrayable<RestNewResource> | null | undefined,
  Deserialized extends DeserializedData = DeserializedData,
  Extract extends DeserializerExtract<Record> = DeserializerExtract<Record>,
>(
  config: Partial<RestDeserializerConfig<Record, Data, Deserialized, Extract>> = {},
) => makeDeserializer({
  extractData: (data) => ({
    records: data as Arrayable<RestNewResource> | null,
  } as Extract),
  createRecord: makeDeserializerRecordFactory(
    async (record) => ({
      type: await config.extractType?.(record) ?? record.type,
    }),
    async (record, context, factory) => {
      if (context.prop.key === 'id' && config.extractId) {
        return config.extractId(record, context);
      }

      if (isRelation(context.prop)) {
        return mapArrayable(
          record[context.key],
          (value) => factory((typeof value === 'object' ? value : { id: value }) as Record),
        );
      }

      return record[context.key];
    },
  ),
  ...config,
});
