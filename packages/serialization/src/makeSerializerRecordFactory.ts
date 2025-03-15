import { Action, ModelSnapshot } from '@foscia/core';
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
  initialize: (snapshot: ModelSnapshot, action: Action) => Awaitable<Record>,
  put: (
    record: Record,
    serializerContext: SerializerContext<Record, Related, Data>,
  ) => Awaitable<void>,
): SerializerRecordFactory<Record, Related, Data> => async (
  snapshot: ModelSnapshot,
  action: Action,
) => {
  const record = await initialize(snapshot, action);

  return {
    put: (
      serializerContext: SerializerContext<Record, Related, Data>,
    ) => put(record, serializerContext),
    retrieve: () => record,
  };
};
