import { DataDeserializerResult, ModelRelationProp } from '@foscia/core';
import {
  DeserializerContext,
  DeserializerExtract,
  DeserializerRecord,
  DeserializerRecordParent,
  DataDeserializerConfig,
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
export default function makeDeserializerRecordPreparator<
  ExtractedData,
  Record,
>(
  initialize: (
    record: Record,
    extract: ExtractedData,
  ) => Awaitable<{ type?: string; }>,
  pull: (
    record: Record,
    deserializerContext: DeserializerContext<Record, ExtractedData>,
    factory: (
      relatedRecord: Record,
    ) => Promise<DeserializerRecord<Record, ExtractedData>>,
  ) => Awaitable<unknown>,
) {
  const factory = async (
    extract: ExtractedData,
    record: Record,
    parent?: DeserializerRecordParent,
  ) => ({
    extract,
    raw: record,
    ...await initialize(record, extract),
    parent,
    pull: (
      deserializerContext: DeserializerContext<Record, ExtractedData>,
    ) => pull(record, deserializerContext, (relatedRecord) => factory(extract, relatedRecord, {
      instance: deserializerContext.instance,
      prop: deserializerContext.prop as ModelRelationProp,
    })),
  });

  return factory satisfies DataDeserializerConfig<Record, unknown, DataDeserializerResult, ExtractedData>['prepareRecord'];
}
