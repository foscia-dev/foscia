import { Dictionary } from '@foscia/shared/types';

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
export type JsonApiAttributes = Dictionary<unknown>;

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
export type JsonApiResource = JsonApiResourceIdentifier & {
  attributes?: JsonApiAttributes;
  relationships?: JsonApiRelationships;
  links?: JsonApiLinks;
  meta?: JsonApiMeta;
};

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-resource-objects)
 *
 * @internal
 *
 * @todo Find another name.
 */
export type JsonApiNewResource = Partial<JsonApiResourceIdentifier> & {
  attributes?: JsonApiAttributes;
  relationships?: JsonApiRelationships;
  meta?: JsonApiMeta;
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
export type JsonApiDocument<
  Resource extends JsonApiNewResource | JsonApiResourceIdentifier = JsonApiResource,
> = {
  data?: Resource[] | Resource | null;
  included?: Resource[];
  links?: JsonApiLinks;
  meta?: JsonApiMeta;
  errors?: JsonApiError[];
  jsonapi?: {
    version?: string;
    meta?: JsonApiMeta;
  };
};
