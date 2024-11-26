import isNil from '@foscia/shared/checks/isNil';
import { Optional } from '@foscia/shared/types';

/**
 * Check if value is `undefined`, `null` or an empty string.
 *
 * @param value
 *
 * @internal
 */
export default (value: unknown): value is Optional<''> => isNil(value) || value === '';
