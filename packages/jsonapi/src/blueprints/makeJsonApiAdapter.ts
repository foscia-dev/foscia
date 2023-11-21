import { bodyAsJson, deepParamsSerializer } from '@foscia/http';
import JsonApiAdapter from '@foscia/jsonapi/jsonApiAdapter';
import { RestAdapterConfig } from '@foscia/rest';

export default function makeJsonApiAdapter(config: Partial<RestAdapterConfig> = {}) {
  return {
    adapter: new JsonApiAdapter({
      baseURL: '/api/v1',
      includeQueryParameter: 'include',
      serializeParams: deepParamsSerializer,
      defaultBodyAs: bodyAsJson,
      defaultHeaders: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        ...config.defaultHeaders,
      },
      ...config,
    }),
  };
}
