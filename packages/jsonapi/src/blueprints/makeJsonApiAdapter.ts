import { bodyAsJson, deepParamsSerializer, HttpAdapterConfig } from '@foscia/http';
import JsonApiAdapter from '@foscia/jsonapi/jsonApiAdapter';

export default function makeJsonApiAdapter(config: Partial<HttpAdapterConfig> = {}) {
  return {
    adapter: new JsonApiAdapter({
      baseURL: '/api/v1',
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
