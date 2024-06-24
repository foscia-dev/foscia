import { Action, appendExtension, WithParsedExtension } from '@foscia/core';
import sortBy from '@foscia/jsonapi/actions/context/enhancers/sortBy';
import { ArrayableVariadic, wrapVariadic } from '@foscia/shared';

/**
 * Shortcut for the {@link sortBy} function with an asc direction.
 *
 * @param keys
 *
 * @category Enhancers
 */
function sortByAsc(...keys: ArrayableVariadic<string>) {
  return sortBy(wrapVariadic(...keys), 'asc');
}

export default /* @__PURE__ */ appendExtension(
  'sortByAsc',
  sortByAsc,
  'use',
) as WithParsedExtension<typeof sortByAsc, {
  sortByAsc<C extends {}, E extends {}>(
    this: Action<C, E>,
    ...keys: ArrayableVariadic<string>
  ): Action<C, E>;
}>;
