import { makeEnhancer } from '@foscia/core';
import sortBy from '@foscia/jsonapi/actions/context/enhancers/sortBy';
import { Arrayable } from '@foscia/shared';

/**
 * Shortcut for the {@link sortBy | `sortBy`} function with an ascending direction.
 *
 * @param keys
 *
 * @category Enhancers
 *
 * @example
 * ```typescript
 * import { query, all } from '@foscia/core';
 * import { sortByAsc } from '@foscia/jsonapi';
 *
 * const posts = await action(
 *   query(Post),
 *   sortByAsc('title'),
 *   sortByAsc(['publishedAt', 'title']),
 *   all(),
 * );
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('sortByAsc', (
  keys: Arrayable<string>,
) => sortBy(keys, 'asc'));
