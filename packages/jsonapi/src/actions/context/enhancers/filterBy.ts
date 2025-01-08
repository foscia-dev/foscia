import { Action, makeEnhancer } from '@foscia/core';
import { consumeRequestObjectParams, param } from '@foscia/http';
import { Dictionary } from '@foscia/shared';

/**
 * [Filter the JSON:API resource](https://jsonapi.org/format/#fetching-filtering)
 * by the given key and value.
 * When key is an object, it will spread the object as a filter values map.
 * The new filter will be merged with the previous ones.
 *
 * @param key
 * @param value
 *
 * @category Enhancers
 *
 * @example
 * ```typescript
 * import { query, all } from '@foscia/core';
 * import { filterBy } from '@foscia/jsonapi';
 *
 * const posts = await action().run(
 *   query(Post),
 *   filterBy('tag', 'news'),
 *   filterBy({ published: 1 }),
 *   all(),
 * );
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('filterBy', <C extends {}>(
  key: string | Dictionary,
  value?: unknown,
) => async (action: Action<C>) => action.use(param('filter', {
  ...consumeRequestObjectParams(await action.useContext())?.filter,
  ...(typeof key === 'string' ? { [key]: value } : key),
})));
