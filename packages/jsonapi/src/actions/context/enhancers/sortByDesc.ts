import { makeEnhancer } from '@foscia/core';
import sortBy from '@foscia/jsonapi/actions/context/enhancers/sortBy';
import { Arrayable } from '@foscia/shared';

/**
 * Shortcut for the {@link sortBy | `sortBy`} function with a descending direction.
 *
 * @param keys
 *
 * @category Enhancers
 *
 * @example
 * ```typescript
 * import { query, all } from '@foscia/core';
 * import { sortByDesc } from '@foscia/jsonapi';
 *
 * const posts = await action(
 *   query(Post),
 *   sortByDesc('title'),
 *   sortByDesc(['publishedAt', 'title']),
 *   all(),
 * );
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('sortByDesc', (
  keys: Arrayable<string>,
) => sortBy(keys, 'desc'));
