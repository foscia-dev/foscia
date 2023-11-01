import { Action, ActionParsedExtension, makeEnhancersExtension } from '@foscia/core';
import sortBy from '@foscia/jsonapi/actions/context/enhancers/sortBy';
import { ArrayableVariadic, wrapVariadic } from '@foscia/shared';

/**
 * Shortcut for the {@link sortBy} function with an asc direction.
 *
 * @param keys
 *
 * @category Enhancers
 */
export default function sortByAsc(...keys: ArrayableVariadic<string>) {
  return sortBy(wrapVariadic(...keys), 'asc');
}

type SortByAscEnhancerExtension = ActionParsedExtension<{
  sortByAsc<C extends {}, E extends {}>(
    this: Action<C, E>,
    ...keys: ArrayableVariadic<string>
  ): Action<C, E>;
}>;

sortByAsc.extension = makeEnhancersExtension({ sortByAsc }) as SortByAscEnhancerExtension;
