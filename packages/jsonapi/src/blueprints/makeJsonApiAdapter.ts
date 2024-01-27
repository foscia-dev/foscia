import { deepParamsSerializer } from '@foscia/http';
import { makeRestAdapterWith, RestAdapterConfig } from '@foscia/rest';

export default function makeJsonApiAdapter<Data = any>(
  config: Partial<RestAdapterConfig<Data>> = {},
) {
  return {
    adapter: makeRestAdapterWith({
      baseURL: '/api/v1',
      serializeParams: deepParamsSerializer,
      defaultHeaders: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        ...config.defaultHeaders,
      },
      ...config,
    }),
  };
}
