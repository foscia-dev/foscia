import { RestNewResource, RestSerializerConfig } from '@foscia/rest/types';
import { makeSerializer, makeSerializerRecordFactory } from '@foscia/serialization';
import { Arrayable, tap } from '@foscia/shared';

/**
 * Make a REST serializer object.
 *
 * @param config
 *
 * @category Factories
 * @since 0.13.0
 */
export default <
  Record extends RestNewResource = RestNewResource,
  Related = string,
  Data = Arrayable<RestNewResource> | null,
>(
  config?: Partial<RestSerializerConfig<Record, Related, Data>>,
) => makeSerializer({
  createRecord: makeSerializerRecordFactory(
    (snapshot) => tap({} as Record, (record) => {
      if (config?.serializeType) {
        // eslint-disable-next-line no-param-reassign
        record.type = snapshot.$instance.$model.$type;
      }
    }),
    (record, { key, value }) => {
      // eslint-disable-next-line no-param-reassign
      record[key as keyof Record] = value as Record[keyof Record];
    },
  ),
  ...config,
});
