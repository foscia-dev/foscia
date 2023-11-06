import { Dictionary } from '@foscia/shared';

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-links)
 */
export type JsonApiLink = {
  href: string;
  meta?: JsonApiMeta;
} | string;

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-links)
 */
export type JsonApiLinks = Dictionary<JsonApiLink>;

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-meta)
 */
export type JsonApiMeta = Dictionary<any>;

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-resource-identifier-objects)
 */
export type JsonApiResourceIdentifier = {
  type: string;
  id: string;
  lid?: string;
};

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-resource-object-attributes)
 */
export type JsonApiAttributes = Dictionary;

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-resource-object-relationships)
 */
export type JsonApiRelationship = {
  data?: JsonApiResourceIdentifier[] | JsonApiResourceIdentifier | null;
  links?: JsonApiLinks;
  meta?: JsonApiMeta;
};

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-resource-object-relationships)
 */
export type JsonApiRelationships = Dictionary<JsonApiRelationship>;

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-resource-objects)
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
 */
export type JsonApiResource = JsonApiAbstractResource & {
  id: string;
};

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#document-resource-objects)
 */
export type JsonApiNewResource = JsonApiAbstractResource & {
  id?: string;
};

/**
 * @see [JSON:API specification](https://jsonapi.org/format/#error-objects)
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
