import { consumeInclude, normalizeInclude } from '@foscia/core';
import { HttpAdapter, HttpRequestConfig } from '@foscia/http';
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

  protected async makeRequestURLParams(context: HttpRequestConfig): Promise<string | undefined> {
    const params = await super.makeRequestURLParams(context);
    if (!this.includeQueryParameter) {
      return params;
    }

    const include = await normalizeInclude(context, consumeInclude(context, null) ?? []);

    return optionalJoin([
      params,
      this.makeRequestURLParamsFromObject({
        [this.includeQueryParameter]: include.length ? optionalJoin(include, ',') : undefined,
      }),
    ], '&');
  }
}
