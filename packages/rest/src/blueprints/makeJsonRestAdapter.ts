import { paramsSerializer } from '@foscia/http';
import makeRestAdapterWith from '@foscia/rest/makeRestAdapterWith';
import { RestAdapterConfig } from '@foscia/rest/types';

export default function makeJsonRestAdapter<Data = any>(
  config: Partial<RestAdapterConfig<Data>> = {},
) {
  return {
    adapter: makeRestAdapterWith({
      baseURL: '/api',
      serializeParams: paramsSerializer,
      ...config,
    }),
  };
}
