import { ModelInstance } from '@foscia/core';
import { SerializerContext, SerializerRecordFactory } from '@foscia/serialization/types';
import { Awaitable } from '@foscia/shared';

/**
 * Make a {@link SerializerRecordFactory | `SerializerRecordFactory`} implementation.
 *
 * @param initialize
 * @param put
 *
 * @category Factories
 */
export default <
  Record,
  Related,
  Data,
>(
  initialize: (instance: ModelInstance, context: {}) => Awaitable<Record>,
  put: (
    record: Record,
    serializerContext: SerializerContext<Record, Related, Data>,
  ) => Awaitable<void>,
): SerializerRecordFactory<Record, Related, Data> => async (
  instance: ModelInstance,
  context: {},
) => {
  const record = await initialize(instance, context);

  return {
    put: (
      serializerContext: SerializerContext<Record, Related, Data>,
    ) => put(record, serializerContext),
    retrieve: () => record,
  };
};
