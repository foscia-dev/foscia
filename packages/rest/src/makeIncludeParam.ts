import { consumeInclude, normalizeInclude } from '@foscia/core';
import { isNil, optionalJoin } from '@foscia/shared';

/**
 * Make a query parameters object containing requested included relations.
 *
 * @param context
 * @param includeParamKey
 *
 * @internal
 */
export default async (
  context: {},
  includeParamKey: string | null = 'include',
) => {
  if (!isNil(includeParamKey)) {
    const include = consumeInclude(context, []);
    if (include.length) {
      return {
        [includeParamKey]: optionalJoin(await normalizeInclude(context, include), ','),
      };
    }
  }

  return {};
};
