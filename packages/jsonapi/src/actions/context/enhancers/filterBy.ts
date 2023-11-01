import { Action, ActionParsedExtension, makeEnhancersExtension } from '@foscia/core';
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
 */
export default function filterBy(key: string | Dictionary, value?: unknown) {
  return async <C extends {}>(action: Action<C>) => action.use(param('filter', {
    ...consumeRequestObjectParams(await action.useContext())?.filter,
    ...(typeof key === 'string' ? { [key]: value } : key),
  }));
}

type FilterByEnhancerExtension = ActionParsedExtension<{
  filterBy<C extends {}, E extends {}>(
    this: Action<C, E>,
    key: string | Dictionary,
    value?: unknown,
  ): Action<C, E>;
}>;

filterBy.extension = makeEnhancersExtension({ filterBy }) as FilterByEnhancerExtension;
