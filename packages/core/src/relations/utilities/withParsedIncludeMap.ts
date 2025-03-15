import { Action } from '@foscia/core/actions/types';
import { Model } from '@foscia/core/model/types';
import { ParsedIncludeMap, ParsedRawInclude } from '@foscia/core/relations/types';
import parseRawInclude from '@foscia/core/relations/utilities/parseRawInclude';
import { Awaitable } from '@foscia/shared';

/**
 * Run callback with parsed includes if non-empty.
 *
 * @param action
 * @param models
 * @param rawIncludes
 * @param callback
 *
 * @category Utilities
 * @internal
 */
export default async (
  action: Action,
  models: Model[],
  rawIncludes: ParsedRawInclude[],
  callback: (include: ParsedIncludeMap) => Awaitable<void>,
) => {
  const include = await parseRawInclude(action, models, rawIncludes);
  if (include.size) {
    await callback(include);
  }
};
