import HttpAdapter from '@foscia/http/httpAdapter';
import { HttpAdapterConfig } from '@foscia/http/types';
import paramsSerializer from '@foscia/http/utilities/paramsSerializer';

export default function makeHttpAdapter(config: Partial<HttpAdapterConfig> = {}) {
  return {
    adapter: new HttpAdapter({
      baseURL: '/',
      serializeParams: paramsSerializer,
      ...config,
    }),
  };
}
