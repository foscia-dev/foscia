import { ModelPrimaryProp, ModelPrimaryType } from '@foscia/core';
import { HttpAdapterConfig } from '@foscia/http';
import { RestResource } from '@foscia/rest/specification';
import {
  DataDeserializerConfig,
  DeserializerContext,
  SnapshotsSerializerConfig,
} from '@foscia/serialization';
import { Awaitable, Dictionary } from '@foscia/shared';

/**
 * Configuration for REST adapter.
 *
 * @interface
 *
 * @internal
 */
export type RestAdapterConfig<Data = any> = HttpAdapterConfig<Data>;

/**
 * Configuration for REST deserializer.
 *
 * @interface
 *
 * @internal
 */
export interface RestDeserializerConfig<
  Document,
  DeserializedData,
  ExtractedData,
  Record extends RestResource,
> extends Partial<DataDeserializerConfig<Document, DeserializedData, ExtractedData, Record>> {
  /**
   * Extract and parse ID from a REST record.
   *
   * @param record
   */
  extractPrimary?: (
    context: DeserializerContext<ExtractedData, Record, ModelPrimaryProp, undefined>,
  ) => Awaitable<ModelPrimaryType | null | undefined>;
}

export type RestSerializerRecord = Dictionary<unknown>;

/**
 * Configuration for REST serializer.
 *
 * @interface
 *
 * @internal
 */
export type RestSerializerConfig<
  Record extends RestNewResource,
  Related,
  Data,
> =
  & {
    /**
     * Append a `type` field on the serialized record containing the
     * model type. Defaults to `false`.
     */
    serializeType?: boolean;
  }
  & Partial<SnapshotsSerializerConfig<Record, Related, Data>>;

/**
 * Configuration for REST eager loader.
 *
 * @interface
 *
 * @internal
 */
export type RestEagerLoaderConfig = {
  /**
   * Query parameter key for included relations string.
   */
  param: string;
};
