import { Action, ActionParsedExtension, makeEnhancersExtension } from '@foscia/core';
import sortBy from '@foscia/jsonapi/actions/context/enhancers/sortBy';
import { ArrayableVariadic, wrapVariadic } from '@foscia/shared';

/**
 * Shortcut for the {@link sortBy} function with a desc direction.
 *
 * @param keys
 *
 * @category Enhancers
 */
export default function sortByDesc(...keys: ArrayableVariadic<string>) {
  return sortBy(wrapVariadic(...keys), 'desc');
}

type SortByDescEnhancerExtension = ActionParsedExtension<{
  sortByDesc<C extends {}, E extends {}>(
    this: Action<C, E>,
    ...keys: ArrayableVariadic<string>
  ): Action<C, E>;
}>;

sortByDesc.extension = makeEnhancersExtension({ sortByDesc }) as SortByDescEnhancerExtension;
