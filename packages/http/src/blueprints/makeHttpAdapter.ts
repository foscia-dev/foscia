import makeHttpAdapterWith from '@foscia/http/makeHttpAdapterWith';
import { HttpAdapterConfig } from '@foscia/http/types';
import paramsSerializer from '@foscia/http/utilities/paramsSerializer';

export default <Data = any>(config: Partial<HttpAdapterConfig<Data>> = {}) => ({
  adapter: makeHttpAdapterWith({
    baseURL: '/',
    serializeParams: paramsSerializer,
    ...config,
  }),
});
