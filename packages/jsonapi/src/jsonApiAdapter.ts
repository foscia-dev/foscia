import { consumeInclude, normalizeInclude } from '@foscia/core';
import { HttpAdapter, HttpRequestConfig } from '@foscia/http';
import { optionalJoin } from '@foscia/shared';

export default class JsonApiAdapter extends HttpAdapter {
  protected async makeRequestURLParams(context: HttpRequestConfig): Promise<string | undefined> {
    const include = await normalizeInclude(context, consumeInclude(context, null) ?? []);

    return optionalJoin([
      await super.makeRequestURLParams(context),
      this.makeRequestURLParamsFromObject({
        include: include.length ? optionalJoin(include, ',') : undefined,
      }),
    ], '&');
  }
}
