import { Action, appendExtension, WithParsedExtension } from '@foscia/core';
import { consumeRequestObjectParams, param } from '@foscia/http';
import { Arrayable, Dictionary, optionalJoin, uniqueValues, wrap } from '@foscia/shared';

/**
 * Sort direction to apply.
 */
type SortDirection = 'asc' | 'desc';

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
 */
const sortBy: {
  (
    keys: Dictionary<SortDirection>,
  ): <C extends {}, E extends {}>(action: Action<C, E>) => Promise<void>;
  (
    keys: Arrayable<string>,
    directions?: Arrayable<SortDirection>,
  ): <C extends {}, E extends {}>(action: Action<C, E>) => Promise<void>;
} = (
  keys: Arrayable<string> | Dictionary<SortDirection>,
  directions: Arrayable<SortDirection> = 'asc',
) => async <C extends {}, E extends {}>(action: Action<C, E>) => {
  const [newKeys, newDirections] = resolveKeysDirections(keys, directions);

  action.use(param(
    'sort',
    optionalJoin(uniqueValues([
      consumeRequestObjectParams(await action.useContext())?.sort,
      ...newKeys.map((k, i) => serializeSort(k, newDirections[i] ?? newDirections[0])),
    ]), ','),
  ));
};

export default /* @__PURE__ */ appendExtension(
  'sortBy',
  sortBy,
  'use',
) as WithParsedExtension<typeof sortBy, {
  sortBy<C extends {}, E extends {}>(
    this: Action<C, E>,
    keys: Arrayable<string>,
    direction?: 'asc' | 'desc',
  ): Action<C, E>;
}>;
