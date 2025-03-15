import { DeserializedData, ModelIdType, ModelInstance } from '@foscia/core';
import type { SortDirection } from '@foscia/jsonapi/actions/context/enhancers/sortBy';
import { RestAdapterConfig } from '@foscia/rest';
import {
  DeserializerContext,
  DeserializerExtract,
  RecordDeserializerConfig,
  RecordSerializerConfig,
} from '@foscia/serialization';
import { Awaitable, Dictionary, Multimap } from '@foscia/shared';

export type {
  SortDirection,
};

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
    included: Multimap<[string, ModelIdType], Record>;
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
 * @interface
 *
 * @internal
 */
export type JsonApiAdapterConfig<Data = any> = RestAdapterConfig<Data>;

/**
 * Configuration for JSON:API deserializer.
 *
 * @interface
 *
 * @internal
 */
export type JsonApiDeserializerConfig<
  Record extends JsonApiNewResource,
  Data extends JsonApiDocument | null | undefined,
  Deserialized extends JsonApiDeserializedData,
  Extract extends JsonApiExtractedData<Record>,
> =
  & {
    /**
     * Extract and parse an ID from a JSON:API record.
     *
     * @param record
     */
    extractId: (
      record: Record,
      deserializerContext: DeserializerContext<Record, Data, Deserialized, Extract>,
    ) => Awaitable<ModelIdType | null | undefined>;
    /**
     * Extract and parse type from a JSON:API record.
     *
     * @param record
     */
    extractType: (record: Record) => Awaitable<string | undefined>;
  }
  & RecordDeserializerConfig<Record, Data, Deserialized, Extract>;

/**
 * Configuration for JSON:API serializer.
 *
 * @interface
 *
 * @internal
 */
export type JsonApiSerializerConfig<
  Record extends JsonApiNewResource,
  Related extends JsonApiResourceIdentifier,
  Data,
> = RecordSerializerConfig<Record, Related, Data>;
