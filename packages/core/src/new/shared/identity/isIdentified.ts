import { IDENTITIES_KEY } from '@foscia/core/new/shared/identity/consts';
import { Identified } from '@foscia/core/new/shared/identity/types';

/**
 * Check if `value` is a generic identified object.
 *
 * @param value
 *
 * @internal
 */
export default function isIdentified(value: unknown): value is Identified<symbol> {
  return !!value
    && (typeof value === 'object' || typeof value === 'function')
    && Object.prototype.hasOwnProperty.call(value, IDENTITIES_KEY);
}
