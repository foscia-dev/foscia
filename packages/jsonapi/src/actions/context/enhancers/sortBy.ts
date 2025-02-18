import { Action, makeEnhancer } from '@foscia/core';
import { consumeRequestObjectParams, param } from '@foscia/http';
import { Arrayable, Dictionary, optionalJoin, uniqueValues, wrap } from '@foscia/shared';

/**
 * Sort direction to apply.
 *
 * @internal
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Resolve the keys and directions arrays from given sort parameters.
 *
 * @param keys
 * @param directions
 */
const resolveKeysDirections = (
  keys: Arrayable<string> | Dictionary<SortDirection>,
  directions: Arrayable<SortDirection> = 'asc',
): [string[], SortDirection[]] => (
  typeof keys === 'object' && !Array.isArray(keys)
    ? [Object.keys(keys), Object.values(keys)]
    : [wrap(keys), wrap(directions)]
);

/**
 * Convert a key to a sorted key usable by a JSON:API.
 *
 * @param key
 * @param direction
 */
const serializeSort = (
  key: string,
  direction: SortDirection,
) => `${direction === 'desc' ? '-' : ''}${key}`;

export default /* @__PURE__ */ makeEnhancer('sortBy', ((
  keys: Arrayable<string> | Dictionary<SortDirection>,
  directions: Arrayable<SortDirection> = 'asc',
) => async <C extends {}>(action: Action<C>) => {
  const [newKeys, newDirections] = resolveKeysDirections(keys, directions);

  action(param(
    'sort',
    optionalJoin(uniqueValues([
      consumeRequestObjectParams(await action.useContext())?.sort,
      ...newKeys.map((k, i) => serializeSort(k, newDirections[i] ?? newDirections[0])),
    ]), ','),
  ));
}) as {
  /**
   * [Sort the JSON:API resource](https://jsonapi.org/format/#fetching-sorting)
   * by the given keys and directions.
   * The new sort will be merged with the previous ones.
   * Sorts priority are kept.
   *
   * @param keys
   *
   * @category Enhancers
   *
   * @example
   * ```typescript
   * import { query, all } from '@foscia/core';
   * import { sortBy } from '@foscia/jsonapi';
   *
   * const posts = await action(
   *   query(Post),
   *   sortBy({ publishedAt: 'desc', title: 'asc' }),
   *   all(),
   * );
   * ```
   */
  (
    keys: Dictionary<SortDirection>,
  ): <C extends {}>(action: Action<C>) => Promise<void>;
  /**
   * [Sort the JSON:API resource](https://jsonapi.org/format/#fetching-sorting)
   * by the given keys and directions.
   * The new sort will be merged with the previous ones.
   * Sorts priority are kept.
   *
   * @param keys
   * @param directions
   *
   * @category Enhancers
   *
   * @example
   * ```typescript
   * import { query, all } from '@foscia/core';
   * import { sortBy } from '@foscia/jsonapi';
   *
   * const posts = await action(
   *   query(Post),
   *   sortBy('title'),
   *   sortBy(['publishedAt', 'title'], ['desc', 'asc']),
   *   all(),
   * );
   * ```
   */
  (
    keys: Arrayable<string>,
    directions?: Arrayable<SortDirection>,
  ): <C extends {}>(action: Action<C>) => Promise<void>;
});
