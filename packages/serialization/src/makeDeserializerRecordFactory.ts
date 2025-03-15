import { DeserializedData, ModelRelation } from '@foscia/core';
import {
  DeserializerContext,
  DeserializerExtract,
  DeserializerRecord,
  DeserializerRecordFactory,
  DeserializerRecordParent,
} from '@foscia/serialization/types';
import { Awaitable } from '@foscia/shared';

/**
 * Make a {@link DeserializerRecordFactory | `DeserializerRecordFactory`} implementation.
 *
 * @param initialize
 * @param pull
 *
 * @category Factories
 */
export default <
  Record,
  Data = unknown,
  Deserialized extends DeserializedData = DeserializedData,
  Extract extends DeserializerExtract<Record> = DeserializerExtract<Record>,
>(
  initialize: (
    record: Record,
    extract: Extract,
  ) => Awaitable<{ type?: string; }>,
  pull: (
    record: Record,
    deserializerContext: DeserializerContext<Record, Data, Deserialized, Extract>,
    factory: (
      relatedRecord: Record,
    ) => Promise<DeserializerRecord<Record, Data, Deserialized, Extract>>,
  ) => Awaitable<unknown>,
) => {
  const factory: DeserializerRecordFactory<Record, Data, Deserialized, Extract> = async (
    extract: Extract,
    record: Record,
    parent?: DeserializerRecordParent,
  ) => ({
    extract,
    raw: record,
    ...await initialize(record, extract),
    parent,
    pull: (
      deserializerContext: DeserializerContext<Record, Data, Deserialized, Extract>,
    ) => pull(record, deserializerContext, (relatedRecord) => factory(extract, relatedRecord, {
      instance: deserializerContext.instance,
      prop: deserializerContext.prop as ModelRelation,
    })),
  });

  return factory;
};
