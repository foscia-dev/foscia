import { ModelIdType } from '@foscia/core';
import {
  JsonApiDeserializedData,
  JsonApiDeserializerConfig,
  JsonApiDocument,
  JsonApiExtractedData,
  JsonApiNewResource,
} from '@foscia/jsonapi/types';
import { makeDeserializerRecordFactory, makeDeserializerWith } from '@foscia/serialization';
import { makeIdentifiersMap, mapArrayable } from '@foscia/shared';

export default function makeJsonApiDeserializer<
  Record extends JsonApiNewResource = JsonApiNewResource,
  Data extends JsonApiDocument = JsonApiDocument,
  Deserialized extends JsonApiDeserializedData = JsonApiDeserializedData,
  Extract extends JsonApiExtractedData<Record> = JsonApiExtractedData<Record>,
>(config: Partial<JsonApiDeserializerConfig<Record, Data, Deserialized, Extract>> = {}) {
  return {
    deserializer: makeDeserializerWith({
      extractData: (data: Data) => {
        const included = makeIdentifiersMap<string, ModelIdType, Record>();
        data.included?.map((record) => included.put(record.type, record.id, record as Record));

        return {
          records: data.data,
          document: data as JsonApiDocument,
          included,
        } as Extract;
      },
      createData: (instances, extract) => ({
        instances, document: extract.document,
      } as Deserialized),
      createRecord: makeDeserializerRecordFactory(
        (record) => record,
        (record, { key }) => record.attributes?.[key],
        (record, { key }, extract) => mapArrayable(
          record.relationships?.[key]?.data,
          (value) => extract.included.find(value.type, value.id) as Record,
        ),
      ),
      ...config,
    }),
  };
}
