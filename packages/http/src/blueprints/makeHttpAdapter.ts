import makeHttpAdapterWith from '@foscia/http/makeHttpAdapterWith';
import { HttpAdapterConfig } from '@foscia/http/types';
import paramsSerializer from '@foscia/http/utilities/paramsSerializer';

export default function makeHttpAdapter(config: Partial<HttpAdapterConfig> = {}) {
  return {
    adapter: makeHttpAdapterWith({
      baseURL: '/',
      serializeParams: paramsSerializer,
      ...config,
    }),
  };
}
