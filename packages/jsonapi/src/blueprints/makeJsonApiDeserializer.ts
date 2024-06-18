import { ModelIdType } from '@foscia/core';
import {
  JsonApiDeserializedData,
  JsonApiDeserializerConfig,
  JsonApiDocument,
  JsonApiExtractedData,
  JsonApiNewResource,
} from '@foscia/jsonapi/types';
import { makeDeserializerRecordFactory, makeDeserializerWith } from '@foscia/serialization';
import { isNil, makeIdentifiersMap, mapArrayable, wrap } from '@foscia/shared';

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

        [...wrap(data.data), ...wrap(data.included)].forEach(
          (record) => !isNil(record.id) && included.put(record.type, record.id, record as Record),
        );

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
        config.pullIdentifier ?? ((record) => record),
        config.pullAttribute ?? ((record, { key }) => record.attributes?.[key]),
        config.pullRelation ?? ((record, { key }, extract) => mapArrayable(
          record.relationships?.[key]?.data,
          (value) => extract.included.find(value.type, value.id) as Record,
        )),
      ),
      ...config,
    }),
  };
}
