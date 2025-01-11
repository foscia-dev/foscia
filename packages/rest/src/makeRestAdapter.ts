import { makeHttpAdapter } from '@foscia/http';
import makeIncludeParam from '@foscia/rest/makeIncludeParam';
import { RestAdapterConfig } from '@foscia/rest/types';
import { kebabCase } from '@foscia/shared';

/**
 * Make a REST adapter object.
 *
 * @param config
 *
 * @category Factories
 * @since 0.13.0
 */
export default <Data = any>(
  config: Partial<RestAdapterConfig<Data>> = {},
) => makeHttpAdapter({
  baseURL: '/api',
  modelPathTransformer: kebabCase,
  relationPathTransformer: kebabCase,
  appendParams: async (context) => ({
    ...await makeIncludeParam(context, config.includeParamKey),
    ...(await config.appendParams?.(context)),
  }),
  ...config,
});
