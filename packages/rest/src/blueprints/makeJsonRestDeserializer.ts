import { DeserializedData } from '@foscia/core';
import { RestDeserializerConfig, RestNewResource } from '@foscia/rest/types';
import {
  DeserializerExtract,
  makeDeserializerRecordFactory,
  makeDeserializerWith,
} from '@foscia/serialization';
import { Arrayable } from '@foscia/shared';

export default function makeJsonRestDeserializer<
  Record extends RestNewResource = RestNewResource,
  Data = Arrayable<RestNewResource> | null,
  Deserialized extends DeserializedData = DeserializedData,
  Extract extends DeserializerExtract<Record> = DeserializerExtract<Record>,
>(config: Partial<RestDeserializerConfig<Record, Data, Deserialized, Extract>> = {}) {
  return {
    deserializer: makeDeserializerWith({
      extractData: (data) => ({
        records: data as Arrayable<RestNewResource> | null,
      } as Extract),
      createRecord: makeDeserializerRecordFactory(
        (record) => record,
        (record, { key }) => record[key],
        (record, { key }) => record[key] as Arrayable<Record> | null,
      ),
      ...config,
    }),
  };
}

makeJsonRestDeserializer({
  extractData: (data: { data: any }) => (data?.data),
});
