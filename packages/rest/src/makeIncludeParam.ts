import { consumeInclude, normalizeInclude } from '@foscia/core';
import { isNil, optionalJoin } from '@foscia/shared';

export default async function makeIncludeParam(
  context: {},
  includeParamKey: string | null = 'include',
) {
  if (!isNil(includeParamKey)) {
    const include = consumeInclude(context, null) ?? [];
    if (include.length) {
      return {
        [includeParamKey]: optionalJoin(await normalizeInclude(context, include), ','),
      };
    }
  }

  return {};
}
