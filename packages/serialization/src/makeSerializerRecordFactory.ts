import { ModelSnapshot } from '@foscia/core';
import { SerializerContext, SerializerRecordFactory } from '@foscia/serialization/types';
import { Awaitable, using } from '@foscia/shared';

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
  initialize: (snapshot: ModelSnapshot, context: {}) => Awaitable<Record>,
  put: (
    record: Record,
    serializerContext: SerializerContext<Record, Related, Data>,
  ) => Awaitable<void>,
): SerializerRecordFactory<Record, Related, Data> => async (
  snapshot: ModelSnapshot,
  context: {},
) => using(await initialize(snapshot, context), (record) => ({
  put: (
    serializerContext: SerializerContext<Record, Related, Data>,
  ) => put(record, serializerContext),
  retrieve: () => record,
}));
