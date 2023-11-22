import { consumeInclude, normalizeInclude } from '@foscia/core';
import { HttpAdapter } from '@foscia/http';
import { RestAdapterConfig } from '@foscia/rest/types';
import { applyConfig, optionalJoin } from '@foscia/shared';

export default class RestAdapter extends HttpAdapter {
  private includeQueryParameter: string | null = null;

  public constructor(config: RestAdapterConfig) {
    super(config);

    this.configure(config);
  }

  public configure(config: RestAdapterConfig, override = true) {
    applyConfig(this, config, override);
  }

  protected async makeRequestURLParams(context: {}): Promise<string | undefined> {
    const params = await super.makeRequestURLParams(context);
    const include = consumeInclude(context, null) ?? [];
    if (!this.includeQueryParameter || include.length === 0) {
      return params;
    }

    return optionalJoin([
      params,
      this.makeRequestURLParamsFromObject({
        [this.includeQueryParameter]: optionalJoin(await normalizeInclude(context, include), ','),
      }),
    ], '&');
  }
}
