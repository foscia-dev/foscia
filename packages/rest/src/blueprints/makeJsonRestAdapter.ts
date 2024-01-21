import { bodyAsJson, paramsSerializer } from '@foscia/http';
import RestAdapter from '@foscia/rest/restAdapter';
import { RestAdapterConfig } from '@foscia/rest/types';

export default function makeJsonRestAdapter(config: Partial<RestAdapterConfig> = {}) {
  return {
    adapter: new RestAdapter({
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
