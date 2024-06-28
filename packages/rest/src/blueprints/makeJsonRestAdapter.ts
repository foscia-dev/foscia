import { paramsSerializer } from '@foscia/http';
import makeRestAdapterWith from '@foscia/rest/makeRestAdapterWith';
import { RestAdapterConfig } from '@foscia/rest/types';
import { toKebabCase } from '@foscia/shared';

export default <Data = any>(
  config: Partial<RestAdapterConfig<Data>> = {},
) => ({
  adapter: makeRestAdapterWith({
    baseURL: '/api',
    serializeParams: paramsSerializer,
    modelPathTransformer: toKebabCase,
    relationPathTransformer: toKebabCase,
    ...config,
  }),
});
