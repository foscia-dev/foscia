import { FosciaFlaggedObject } from '@foscia/shared/types';

/**
 * Check if value is a Foscia flagged object with given bit flag.
 *
 * @param value
 * @param flag
 *
 * @internal
 */
export default <T extends FosciaFlaggedObject>(
  value: unknown,
  flag: number,
): value is T => !!value
  && (typeof value === 'object' || typeof value === 'function')
  && '$FOSCIA_FLAGS' in value
  && typeof value.$FOSCIA_FLAGS === 'number'
  // eslint-disable-next-line no-bitwise
  && !!(flag & value.$FOSCIA_FLAGS);
