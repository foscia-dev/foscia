import { DeserializedData, ModelIdType } from '@foscia/core';
import { HttpAdapterConfig } from '@foscia/http';
import {
  DeserializerContext,
  DeserializerExtract,
  RecordDeserializerConfig,
  RecordSerializerConfig,
} from '@foscia/serialization';
import { Awaitable, Dictionary } from '@foscia/shared';

/**
 * Abstract definition of a REST record.
 *
 * @internal
 */
export type RestAbstractResource = Dictionary & {
  type?: string;
};

/**
 * Abstract definition of a new REST record.
 *
 * @internal
 */
export type RestNewResource = RestAbstractResource & {
  id?: ModelIdType;
};

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
export type RestDeserializerConfig<
  Record,
  Data,
  Deserialized extends DeserializedData,
  Extract extends DeserializerExtract<Record>,
> =
  & {
    /**
     * Extract and parse ID from a REST record.
     *
     * @param record
     */
    extractId: (
      record: Record,
      deserializerContext: DeserializerContext<Record, Data, Deserialized, Extract>,
    ) => Awaitable<ModelIdType | null | undefined>;
    /**
     * Extract and parse type from a REST record.
     *
     * @param record
     */
    extractType: (record: Record) => Awaitable<string | undefined>;
  }
  & RecordDeserializerConfig<Record, Data, Deserialized, Extract>;

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
  & RecordSerializerConfig<Record, Related, Data>;

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
