import { Action, ActionParsedExtension, makeEnhancersExtension } from '@foscia/core';
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
function resolveKeysDirections(
  keys: Arrayable<string> | Dictionary<SortDirection>,
  directions: Arrayable<SortDirection> = 'asc',
): [string[], SortDirection[]] {
  if (typeof keys === 'object' && !Array.isArray(keys)) {
    return [Object.keys(keys), Object.values(keys)];
  }

  return [wrap(keys), wrap(directions)];
}

/**
 * Convert a key to a sorted key usable by a JSON:API.
 *
 * @param key
 * @param direction
 */
function serializeSort(key: string, direction: SortDirection) {
  return `${direction === 'desc' ? '-' : ''}${key}`;
}

function sortBy(
  keys: Dictionary<SortDirection>,
): <C extends {}, E extends {}>(action: Action<C, E>) => Promise<void>;
function sortBy(
  keys: Arrayable<string>,
  directions?: Arrayable<SortDirection>,
): <C extends {}, E extends {}>(action: Action<C, E>) => Promise<void>;

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
function sortBy(
  keys: Arrayable<string> | Dictionary<SortDirection>,
  directions: Arrayable<SortDirection> = 'asc',
) {
  return async <C extends {}, E extends {}>(action: Action<C, E>) => {
    const [newKeys, newDirections] = resolveKeysDirections(keys, directions);

    action.use(param(
      'sort',
      optionalJoin(uniqueValues([
        consumeRequestObjectParams(await action.useContext())?.sort,
        ...newKeys.map((k, i) => serializeSort(k, newDirections[i] ?? newDirections[0])),
      ]), ','),
    ));
  };
}

type SortByEnhancerExtension = ActionParsedExtension<{
  sortBy<C extends {}, E extends {}>(
    this: Action<C, E>,
    keys: Arrayable<string>,
    direction?: 'asc' | 'desc',
  ): Action<C, E>;
}>;

sortBy.extension = makeEnhancersExtension({ sortBy }) as SortByEnhancerExtension;

export default sortBy;
