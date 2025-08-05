import isModelRelation from '@foscia/core/models/definition/utilities/isModelRelation';
import deserializeProp from '@foscia/core/props/internals/deserializeProp';
import { RestResource } from '@foscia/rest/specification';
import { DataDeserializerConfig, makeDataDeserializer } from '@foscia/serialization';
import { mapArrayable } from '@foscia/shared';

/**
 * Make a REST deserializer object.
 *
 * @param config
 *
 * @category Factories
 * @since 0.13.0
 */
export default <
  Document = RestResource[] | RestResource | null | undefined,
  DeserializedData = undefined,
  ExtractedData = undefined,
  Record extends RestResource = RestResource,
>(
  config?: Partial<DataDeserializerConfig<Document, DeserializedData, ExtractedData, Record>>,
) => makeDataDeserializer<Document, DeserializedData, ExtractedData, Record>({
  extractRecords: ({ data }) => data as Record[] | Record | null | undefined,
  deserializeType: ({ record }) => (typeof record.type === 'string' ? record.type : null),
  deserializeValue: ({ record, prop, key }, deserialize) => {
    if (isModelRelation(prop)) {
      return mapArrayable(record[key], (value) => deserialize((
        typeof value === 'object' ? value : { id: value }
      ) as Record));
    }

    return deserializeProp(prop, record[key]);
  },
  ...config,
});
