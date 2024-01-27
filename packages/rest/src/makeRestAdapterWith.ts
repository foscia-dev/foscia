import { makeHttpAdapterWith } from '@foscia/http';
import makeIncludeParam from '@foscia/rest/makeIncludeParam';
import { RestAdapterConfig } from '@foscia/rest/types';

export default function makeRestAdapterWith<Data = any>(config: RestAdapterConfig<Data>) {
  return makeHttpAdapterWith({
    ...config,
    appendParams: async (context) => ({
      ...await makeIncludeParam(context, config.includeParamKey),
    }),
  });
}
