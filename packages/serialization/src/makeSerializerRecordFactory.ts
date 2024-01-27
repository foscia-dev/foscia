import { ModelInstance } from '@foscia/core';
import { SerializerContext, SerializerRecordFactory } from '@foscia/serialization/types';
import { Awaitable } from '@foscia/shared';

export default function makeSerializerRecordFactory<
  Record,
  Related,
  Data,
>(
  initialize: (instance: ModelInstance, context: {}) => Awaitable<Record>,
  put: (
    record: Record,
    serializerContext: SerializerContext<Record, Related, Data>,
  ) => Awaitable<void>,
): SerializerRecordFactory<Record, Related, Data> {
  return async (instance: ModelInstance, context: {}) => {
    const record = await initialize(instance, context);

    return {
      put: (
        serializerContext: SerializerContext<Record, Related, Data>,
      ) => put(record, serializerContext),
      retrieve: () => record,
    };
  };
}
