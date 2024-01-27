import { RestNewResource, RestSerializerConfig } from '@foscia/rest/types';
import { makeSerializerRecordFactory, makeSerializerWith } from '@foscia/serialization';
import { Arrayable } from '@foscia/shared';

export default function makeJsonRestSerializer<
  Record extends RestNewResource = RestNewResource,
  Related = string,
  Data = Arrayable<RestNewResource> | null,
>(config?: Partial<RestSerializerConfig<Record, Related, Data>>) {
  return {
    serializer: makeSerializerWith({
      createRecord: makeSerializerRecordFactory(
        (instance) => ({
          type: config?.serializeType ? instance.$model.$type : undefined,
          id: instance.id,
        } as Record),
        (record, { key, value }) => {
          // eslint-disable-next-line no-param-reassign
          record[key as keyof Record] = value as Record[keyof Record];
        },
      ),
      ...config,
    }),
  };
}
