import { consumeInclude, normalizeInclude } from '@foscia/core';
import { HttpAdapter } from '@foscia/http';
import { RestAdapterConfig } from '@foscia/rest/types';
import { optionalJoin } from '@foscia/shared';

export default class RestAdapter extends HttpAdapter {
  declare public readonly $config: RestAdapterConfig;

  declare public configure: (config: Partial<RestAdapterConfig>, override?: boolean) => this;

  public constructor(config: RestAdapterConfig) {
    super(config);
  }

  protected async makeRequestURLParams(context: {}): Promise<string | undefined> {
    const params = await super.makeRequestURLParams(context);
    const include = consumeInclude(context, null) ?? [];
    if (!this.$config.includeQueryParameter || include.length === 0) {
      return params;
    }

    return optionalJoin([
      params,
      this.makeRequestURLParamsFromObject({
        [this.$config.includeQueryParameter]: optionalJoin(await normalizeInclude(context, include), ','),
      }),
    ], '&');
  }
}
