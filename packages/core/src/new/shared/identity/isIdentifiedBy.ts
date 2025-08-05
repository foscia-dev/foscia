import { IDENTITIES_KEY } from '@foscia/core/new/shared/identity/consts';
import isIdentified from '@foscia/core/new/shared/identity/isIdentified';
import { Identified, Identity } from '@foscia/core/new/shared/identity/types';
import { Arrayable, wrap } from '@foscia/shared';

/**
 * Check if `value` is a specific identified object.
 *
 * @param value
 * @param identities
 *
 * @internal
 */
export default function isIdentifiedBy<T extends Identified<symbol>>(
  value: unknown,
  identities: Arrayable<Identity<T>>,
): value is T {
  return isIdentified(value)
    && !wrap(identities).some((identity) => !value[IDENTITIES_KEY].has(identity));
}
