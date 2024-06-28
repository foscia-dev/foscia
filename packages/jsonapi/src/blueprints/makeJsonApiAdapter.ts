import { ActionName, consumeAction } from '@foscia/core';
import { clearEndpoint, deepParamsSerializer } from '@foscia/http';
import { makeRestAdapterWith, RestAdapterConfig } from '@foscia/rest';
import { optionalJoin, toKebabCase } from '@foscia/shared';

export default <Data = any>(
  config: Partial<RestAdapterConfig<Data>> = {},
) => ({
  adapter: makeRestAdapterWith({
    baseURL: '/api/v1',
    buildURL: (endpoint, context) => clearEndpoint(optionalJoin([
      endpoint.baseURL,
      endpoint.modelPath,
      endpoint.idPath,
      (([
        ActionName.ATTACH_RELATION,
        ActionName.UPDATE_RELATION,
        ActionName.DETACH_RELATION,
      ] as any[]).indexOf(consumeAction(context, null)!) !== -1 ? 'relationships' : null),
      endpoint.relationPath,
      endpoint.additionalPath,
    ], '/')),
    modelPathTransformer: toKebabCase,
    relationPathTransformer: toKebabCase,
    serializeParams: deepParamsSerializer,
    defaultHeaders: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      ...config.defaultHeaders,
    },
    ...config,
  }),
});
