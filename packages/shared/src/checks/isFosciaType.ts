import { FosciaObject } from '@foscia/shared/types';

/**
 * Check if value is a Foscia object of given type.
 *
 * @param value
 * @param symbol
 *
 * @internal
 */
export default <S extends symbol>(
  value: unknown,
  symbol: S,
): value is FosciaObject<S> => !!value
  && (typeof value === 'object' || typeof value === 'function')
  && '$FOSCIA_TYPE' in value
  && value.$FOSCIA_TYPE === symbol;
