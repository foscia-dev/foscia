import { isId, isRelation, ModelIdType } from '@foscia/core';
import {
  JsonApiDeserializedData,
  JsonApiDeserializerConfig,
  JsonApiDocument,
  JsonApiExtractedData,
  JsonApiNewResource,
} from '@foscia/jsonapi/types';
import { makeDeserializer, makeDeserializerRecordFactory } from '@foscia/serialization';
import { isNil, mapArrayable, Multimap, multimapGet, multimapSet, wrap } from '@foscia/shared';

/**
 * Make a JSON:API deserializer object.
 *
 * @param config
 *
 * @category Factories
 */
export default <
  Record extends JsonApiNewResource = JsonApiNewResource,
  Data extends JsonApiDocument | null | undefined = JsonApiDocument | null | undefined,
  Deserialized extends JsonApiDeserializedData = JsonApiDeserializedData,
  Extract extends JsonApiExtractedData<Record> = JsonApiExtractedData<Record>,
>(
  config: Partial<JsonApiDeserializerConfig<Record, Data, Deserialized, Extract>> = {},
) => makeDeserializer({
  extractData: (data: Data) => {
    const included: Multimap<[string, ModelIdType], Record> = new Map();

    [...wrap(data?.data), ...wrap(data?.included)].forEach(
      (record) => !isNil(record.id)
        && multimapSet(included, [record.type, record.id], record),
    );

    return {
      records: data?.data,
      document: data as JsonApiDocument,
      included,
    } as Extract;
  },
  createData: (instances, extract) => ({
    instances, document: extract.document ?? {},
  } as Deserialized),
  createRecord: makeDeserializerRecordFactory(
    async (record) => ({
      type: await config.extractType?.(record) ?? record.type,
    }),
    async (record, context, factory) => {
      if (isId(context.prop)) {
        return context.prop.key === 'id'
          ? (config.extractId ?? (() => record.id))(record, context)
          : record.lid;
      }

      if (isRelation(context.prop)) {
        return mapArrayable(
          record.relationships?.[context.key]?.data,
          (value) => factory(multimapGet(context.extract.included, [value.type, value.id])!),
        );
      }

      return record.attributes?.[context.key];
    },
  ),
  ...config,
});
