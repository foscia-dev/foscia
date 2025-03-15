import { ActionKind, isActionKind } from '@foscia/core';
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
  buildURL: async (endpoint, action) => clearEndpoint(optionalJoin([
    endpoint.baseURL,
    endpoint.modelPath,
    endpoint.idPath,
    await isActionKind(action, [
      ActionKind.ATTACH_RELATION,
      ActionKind.UPDATE_RELATION,
      ActionKind.DETACH_RELATION,
    ]) ? 'relationships' : null,
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
