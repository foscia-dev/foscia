import { DeserializedData, ModelAttribute, ModelRelation } from '@foscia/core';
import {
  DeserializerContext,
  DeserializerExtract,
  DeserializerRecordFactory,
  DeserializerRecordIdentifier,
  DeserializerRecordParent,
} from '@foscia/serialization/types';
import { Arrayable, Awaitable, mapArrayable } from '@foscia/shared';

export default function makeDeserializerRecordFactory<
  Record,
  Data = unknown,
  Deserialized extends DeserializedData = DeserializedData,
  Extract extends DeserializerExtract<Record> = DeserializerExtract<Record>,
>(
  pullIdentifier: (record: Record, context: {}) => Awaitable<DeserializerRecordIdentifier>,
  pullAttribute: (
    record: Record,
    deserializerContext: DeserializerContext<Record, Data, Deserialized, ModelAttribute>,
    extract: Extract,
  ) => Awaitable<unknown>,
  pullRelation: (
    record: Record,
    deserializerContext: DeserializerContext<Record, Data, Deserialized, ModelRelation>,
    extract: Extract,
  ) => Awaitable<Arrayable<Record> | null | undefined>,
): DeserializerRecordFactory<Record, Data, Deserialized, Extract> {
  const factory = async (
    extract: Extract,
    record: Record,
    context: {},
    parent?: DeserializerRecordParent,
  ) => ({
    raw: record,
    identifier: await pullIdentifier(record, context),
    parent,
    pullAttribute: (
      deserializerContext: DeserializerContext<Record, Data, Deserialized, ModelAttribute>,
    ) => pullAttribute(record, deserializerContext, extract),
    pullRelation: async (
      deserializerContext: DeserializerContext<Record, Data, Deserialized, ModelRelation>,
    ) => mapArrayable(
      await pullRelation(record, deserializerContext, extract),
      (value) => factory(extract, value as Record, context, {
        instance: deserializerContext.instance,
        def: deserializerContext.def,
      }),
    ),
  });

  return factory;
}
