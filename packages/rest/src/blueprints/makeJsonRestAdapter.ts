import { bodyAsJson, paramsSerializer } from '@foscia/http';
import makeRestAdapterWith from '@foscia/rest/makeRestAdapterWith';
import { RestAdapterConfig } from '@foscia/rest/types';

export default function makeJsonRestAdapter(config: Partial<RestAdapterConfig> = {}) {
  return {
    adapter: makeRestAdapterWith({
      baseURL: '/api',
      serializeParams: paramsSerializer,
      defaultBodyAs: bodyAsJson,
      defaultHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...config.defaultHeaders,
      },
      ...config,
    }),
  };
}
