import isModelRelation from '@foscia/core/models/definition/utilities/isModelRelation';
import deserializeProp from '@foscia/core/props/internals/deserializeProp';
import {
  JsonApiDocument,
  JsonApiResource,
  JsonApiResourceIdentifier,
} from '@foscia/jsonapi/specification';
import { JsonApiDeserializedData, JsonApiExtractedData } from '@foscia/jsonapi/types';
import { DataDeserializerConfig, makeDataDeserializer } from '@foscia/serialization';
import { makeMultimap, mapArrayable, wrap } from '@foscia/shared';

/**
 * Make a JSON:API deserializer object.
 *
 * @param config
 *
 * @category Factories
 */
export default function makeJsonApiDeserializer<
  Document extends JsonApiDocument<Record> | null | undefined,
  DeserializedData extends JsonApiDeserializedData<Document>,
  ExtractedData extends JsonApiExtractedData<Document, Record>,
  Record extends JsonApiResource,
>(
  config?: Partial<DataDeserializerConfig<Document, DeserializedData, ExtractedData, Record>>,
) {
  const makeRecordIdentifier = (record: JsonApiResource | JsonApiResourceIdentifier) => ({
    type: record.type,
    id: record.id,
    lid: record.lid,
  });

  return makeDataDeserializer<Document, DeserializedData, ExtractedData, Record>({
    extractRecords: ({ data }) => data?.data,
    extractData: ({ data }) => ({
      document: data ?? {},
      included: makeMultimap(
        [...wrap(data?.data), ...wrap(data?.included)]
          .reduce((entries: [JsonApiResourceIdentifier, Record][], record) => {
            entries.push([makeRecordIdentifier(record), record] as const);

            return entries;
          }, []),
      ),
    } satisfies JsonApiExtractedData<JsonApiDocument<Record>, Record> as ExtractedData),
    deserializeType: ({ record }) => record.type,
    deserializeValue: ({ data, record, prop, key }, deserialize) => {
      if (isModelRelation(prop)) {
        return mapArrayable(
          record.relationships?.[key]?.data,
          (reference) => deserialize(data.included.get(makeRecordIdentifier(reference))!) as any,
        );
      }

      const value = key === 'id' || key === 'lid'
        ? record[key]
        : record.attributes?.[key];
      if (value !== undefined) {
        return deserializeProp(prop, value);
      }

      return undefined;
    },
    deserializeData: ({ data }) => ({
      document: data.document,
    } satisfies JsonApiDeserializedData<Document> as DeserializedData),
    ...config,
  });
}
