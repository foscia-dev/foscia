import { IDENTITIES_KEY } from '@foscia/core/new/shared/identity/consts';
import isIdentified from '@foscia/core/new/shared/identity/isIdentified';
import { Identified } from '@foscia/core/new/shared/identity/types';

/**
 * Mark an object identified with given identity symbol.
 *
 * @param identity
 * @param value
 *
 * @internal
 */
export default function identify<Id extends symbol, T>(identity: Id, value: T) {
  if (!isIdentified(value)) {
    Object.defineProperty(value, IDENTITIES_KEY, { value: new Set() });
  }

  (value as Identified<Id>)[IDENTITIES_KEY].add(identity);

  return value as T & Identified<Id>;
}
