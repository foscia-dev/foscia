import {
  DeserializedData,
  ModelAttribute,
  ModelIdType,
  ModelInstance,
  ModelRelation,
} from '@foscia/core';
import { RestAdapterConfig } from '@foscia/rest';
import {
  DeserializerConfig,
  DeserializerContext,
  DeserializerExtract,
  DeserializerRecordIdentifier,
  SerializerConfig,
} from '@foscia/serialization';
import { Arrayable, Awaitable, Dictionary, IdentifiersMap } from '@foscia/shared';

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-links)
 *
 * @internal
 */
export type JsonApiLink = {
  href: string;
  meta?: JsonApiMeta;
} | string;

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-links)
 *
 * @internal
 */
export type JsonApiLinks = Dictionary<JsonApiLink>;

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-meta)
 *
 * @internal
 */
export type JsonApiMeta = Dictionary<any>;

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-resource-identifier-objects)
 *
 * @internal
 */
export type JsonApiResourceIdentifier = {
  type: string;
  id: string;
  lid?: string;
};

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-resource-object-attributes)
 *
 * @internal
 */
export type JsonApiAttributes = Dictionary;

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-resource-object-relationships)
 *
 * @internal
 */
export type JsonApiRelationship = {
  data?: JsonApiResourceIdentifier[] | JsonApiResourceIdentifier | null;
  links?: JsonApiLinks;
  meta?: JsonApiMeta;
};

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-resource-object-relationships)
 *
 * @internal
 */
export type JsonApiRelationships = Dictionary<JsonApiRelationship>;

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-resource-objects)
 *
 * @internal
 */
export type JsonApiAbstractResource = {
  type: string;
  lid?: string;
  attributes?: JsonApiAttributes;
  relationships?: JsonApiRelationships;
  links?: JsonApiLinks;
  meta?: JsonApiMeta;
};

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-resource-objects)
 *
 * @internal
 */
export type JsonApiResource = JsonApiAbstractResource & {
  id: string;
};

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-resource-objects)
 *
 * @internal
 */
export type JsonApiNewResource = JsonApiAbstractResource & {
  id?: string;
};

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#error-objects)
 *
 * @internal
 */
export type JsonApiError = {
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
    header?: string;
  };
  meta?: JsonApiMeta;
};

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-top-level)
 *
 * @internal
 */
export type JsonApiDocument = {
  data?: JsonApiResource[] | JsonApiResource | JsonApiNewResource | null;
  included?: JsonApiResource[];
  links?: JsonApiLinks;
  meta?: JsonApiMeta;
  errors?: JsonApiError[];
  jsonapi?: {
    version?: string;
    meta?: JsonApiMeta;
  };
};

/**
 * Extracted data from a JSON:API backend Response object.
 *
 * @internal
 */
export type JsonApiExtractedData<Record extends JsonApiNewResource = JsonApiNewResource> =
  & {
    included: IdentifiersMap<string, ModelIdType, Record>;
    document: JsonApiDocument;
  }
  & DeserializerExtract<Record>;

/**
 * Deserialized data from a JSON:API backend Response object.
 */
export type JsonApiDeserializedData<I extends ModelInstance = ModelInstance> =
  & DeserializedData<I>
  & { document: JsonApiDocument; };

/**
 * Configuration for JSON:API adapter.
 *
 * @internal
 */
export type JsonApiAdapterConfig<Data = any> = RestAdapterConfig<Data>;

/**
 * Configuration for JSON:API deserializer.
 *
 * @internal
 */
export type JsonApiDeserializerConfig<
  Record extends JsonApiNewResource,
  Data extends JsonApiDocument | undefined,
  Deserialized extends JsonApiDeserializedData,
  Extract extends JsonApiExtractedData<Record>,
> =
  & {
    /**
     * Extract identifier (type, ID and LID) from a JSON:API record.
     * Defaults to the record `type`, `id` and `lid` root fields.
     *
     * @param record
     * @param context
     */
    pullIdentifier: (record: Record, context: {}) => Awaitable<DeserializerRecordIdentifier>;
    /**
     * Extract an attribute's value from a JSON:API record.
     * Defaults to the record attribute's value from `attributes` fields.
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
     * Extract a relation's value from a JSON:API record.
     * Defaults to the record relation's value(s) from `relationships` fields
     * mapped with their record found in `included` document key.
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
  & DeserializerConfig<Record, Data, Deserialized, Extract>;

/**
 * Configuration for JSON:API serializer.
 *
 * @internal
 */
export type JsonApiSerializerConfig<
  Record extends JsonApiNewResource,
  Related extends JsonApiResourceIdentifier,
  Data,
> = SerializerConfig<Record, Related, Data>;
