import { ModelPrimaryType, ModelProp } from '@foscia/core';
import type { SortDirection } from '@foscia/jsonapi/actions/context/enhancers/sortBy';
import {
  JsonApiDocument,
  JsonApiNewResource,
  JsonApiResource,
  JsonApiResourceIdentifier,
} from '@foscia/jsonapi/specification';
import { RestAdapterConfig } from '@foscia/rest';
import {
  DataDeserializerConfig,
  DeserializerContext,
  SnapshotsSerializerConfig,
} from '@foscia/serialization';
import { Awaitable, Multimap } from '@foscia/shared';

export type {
  SortDirection,
};

/**
 * Configuration for JSON:API adapter.
 *
 * @interface
 *
 * @internal
 */
export type JsonApiAdapterConfig<Data = any> = RestAdapterConfig<Data>;

/**
 * Extracted data from a JSON:API backend Response object.
 *
 * @internal
 */
export interface JsonApiExtractedData<
  Document extends JsonApiDocument<Record> | null | undefined,
  Record extends JsonApiResource,
> {
  readonly document: Document;
  readonly included: Multimap<JsonApiResourceIdentifier, Record>;
}

/**
 * Deserialized data from a JSON:API backend Response object.
 */
export interface JsonApiDeserializedData<
  Document extends JsonApiDocument | null | undefined,
> {
  readonly document: Document;
}

export type JsonApiSerializerRecord =
  & Partial<Pick<JsonApiResource, 'id'>>
  & Pick<JsonApiResource, 'type' | 'lid' | 'attributes' | 'relationships' | 'meta'>;

/**
 * Configuration for JSON:API serializer.
 *
 * @interface
 *
 * @internal
 */
export interface JsonApiSerializerConfig<
  Document extends JsonApiDocument<Record>,
  PendingRecord extends JsonApiSerializerRecord,
  Record extends JsonApiSerializerRecord,
> extends Partial<SnapshotsSerializerConfig<Document, PendingRecord, Record>> {
}

/**
 * Configuration for JSON:API serializer.
 *
 * @interface
 *
 * @internal
 */
export interface JsonApiRelationSerializerConfig<
  Document extends JsonApiDocument<Record>,
  PendingRecord extends Partial<JsonApiResourceIdentifier>,
  Record extends JsonApiResourceIdentifier,
> extends Partial<SnapshotsSerializerConfig<Document, PendingRecord, Record>> {
}
