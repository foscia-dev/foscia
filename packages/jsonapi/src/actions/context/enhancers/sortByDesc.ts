import { Action, appendExtension, WithParsedExtension } from '@foscia/core';
import sortBy from '@foscia/jsonapi/actions/context/enhancers/sortBy';
import { ArrayableVariadic, wrapVariadic } from '@foscia/shared';

/**
 * Shortcut for the {@link sortBy} function with a desc direction.
 *
 * @param keys
 *
 * @category Enhancers
 */
function sortByDesc(...keys: ArrayableVariadic<string>) {
  return sortBy(wrapVariadic(...keys), 'desc');
}

export default /* @__PURE__ */ appendExtension(
  'sortByDesc',
  sortByDesc,
  'use',
) as WithParsedExtension<typeof sortByDesc, {
  sortByDesc<C extends {}, E extends {}>(
    this: Action<C, E>,
    ...keys: ArrayableVariadic<string>
  ): Action<C, E>;
}>;
