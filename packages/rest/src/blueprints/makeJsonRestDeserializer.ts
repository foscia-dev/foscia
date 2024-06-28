import { DeserializedData } from '@foscia/core';
import { RestDeserializerConfig, RestNewResource } from '@foscia/rest/types';
import {
  DeserializerExtract,
  makeDeserializerRecordFactory,
  makeDeserializerWith,
} from '@foscia/serialization';
import { Arrayable, mapArrayable } from '@foscia/shared';

export default <
  Record extends RestNewResource = RestNewResource,
  Data = Arrayable<RestNewResource> | null,
  Deserialized extends DeserializedData = DeserializedData,
  Extract extends DeserializerExtract<Record> = DeserializerExtract<Record>,
>(config: Partial<RestDeserializerConfig<Record, Data, Deserialized, Extract>> = {}) => ({
  deserializer: makeDeserializerWith({
    extractData: (data) => ({
      records: data as Arrayable<RestNewResource> | null,
    } as Extract),
    createRecord: makeDeserializerRecordFactory(
      config.pullIdentifier ?? ((record) => record),
      config.pullAttribute ?? ((record, { key }) => record[key]),
      config.pullRelation ?? ((record, { key }) => mapArrayable(record[key], (value) => (
        (typeof value === 'object' ? value : { id: value }) as Record
      ))),
    ),
    ...config,
  }),
});
