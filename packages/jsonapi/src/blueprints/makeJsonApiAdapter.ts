import { bodyAsJson, deepParamsSerializer } from '@foscia/http';
import { makeRestAdapterWith, RestAdapterConfig } from '@foscia/rest';

export default function makeJsonApiAdapter(config: Partial<RestAdapterConfig> = {}) {
  return {
    adapter: makeRestAdapterWith({
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
