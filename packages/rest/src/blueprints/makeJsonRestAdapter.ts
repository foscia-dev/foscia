import { bodyAsJson, HttpAdapterConfig, paramsSerializer } from '@foscia/http';
import RestAdapter from '@foscia/rest/restAdapter';

export default function makeJsonRestAdapter(config: Partial<HttpAdapterConfig> = {}) {
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
