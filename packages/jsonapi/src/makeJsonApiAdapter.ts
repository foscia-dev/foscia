import { ActionName, consumeAction } from '@foscia/core';
import { clearEndpoint, deepParamsSerializer } from '@foscia/http';
import { JsonApiAdapterConfig } from '@foscia/jsonapi/types';
import { makeRestAdapter } from '@foscia/rest';
import { optionalJoin } from '@foscia/shared';

/**
 * Make a JSON:API adapter object.
 *
 * @param config
 *
 * @category Factories
 */
export default <Data = any>(
  config: Partial<JsonApiAdapterConfig<Data>> = {},
) => makeRestAdapter({
  baseURL: '/api/v1',
  buildURL: (endpoint, context) => clearEndpoint(optionalJoin([
    endpoint.baseURL,
    endpoint.modelPath,
    endpoint.idPath,
    (([
      ActionName.ATTACH_RELATION,
      ActionName.UPDATE_RELATION,
      ActionName.DETACH_RELATION,
    ] as string[]).indexOf(consumeAction(context, null)!) !== -1 ? 'relationships' : null),
    endpoint.relationPath,
    endpoint.additionalPath,
  ], '/')),
  serializeParams: deepParamsSerializer,
  defaultHeaders: {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    ...config.defaultHeaders,
  },
  ...config,
});
