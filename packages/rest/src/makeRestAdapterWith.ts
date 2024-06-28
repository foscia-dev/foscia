import { makeHttpAdapterWith } from '@foscia/http';
import makeIncludeParam from '@foscia/rest/makeIncludeParam';
import { RestAdapterConfig } from '@foscia/rest/types';

export default <Data = any>(config: RestAdapterConfig<Data>) => makeHttpAdapterWith({
  ...config,
  appendParams: async (context) => ({
    ...await makeIncludeParam(context, config.includeParamKey),
    ...(await config.appendParams?.(context)),
  }),
});
