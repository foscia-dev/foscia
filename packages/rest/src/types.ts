import { DeserializedData, ModelAttribute, ModelIdType, ModelRelation } from '@foscia/core';
import { HttpAdapterConfig } from '@foscia/http';
import {
  RecordDeserializerConfig,
  DeserializerContext,
  DeserializerExtract,
  DeserializerRecordIdentifier,
  RecordSerializerConfig,
} from '@foscia/serialization';
import { Arrayable, Awaitable, Dictionary } from '@foscia/shared';

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
export type RestAdapterConfig<Data = any> = HttpAdapterConfig<Data> & {
  /**
   * Change the `include` query parameter key to append on the request.
   * Defaults to `include`. If `null`, it will not append included relations
   * on the request.
   */
  includeParamKey?: string | null;
};

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
     * Extract identifier (type, ID and LID) from a REST record.
     * Defaults to the record `type`, `id` and `lid` root fields.
     *
     * @param record
     * @param context
     */
    pullIdentifier: (record: Record, context: {}) => Awaitable<DeserializerRecordIdentifier>;
    /**
     * Extract an attribute's value from a REST record.
     * Defaults to the record attribute's value from root fields.
     *
     * @param record
     * @param deserializerContext
     * @param extract
     */
    pullAttribute: (
      record: Record,
      deserializerContext: DeserializerContext<Record, Data, Deserialized, ModelAttribute>,
      extract: Extract,
    ) => Awaitable<unknown>;
    /**
     * Extract a relation's value from a REST record.
     * Defaults to the record relation's value(s) from root fields.
     * When value is an object, it will be deserialized as a normal record.
     *
     * @param record
     * @param deserializerContext
     * @param extract
     */
    pullRelation: (
      record: Record,
      deserializerContext: DeserializerContext<Record, Data, Deserialized, ModelRelation>,
      extract: Extract,
    ) => Awaitable<Arrayable<Record> | null | undefined>;
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
