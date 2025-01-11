import { ObjectTransformer } from '@foscia/core/transformers/types';
import { Awaitable, isNil, Optional } from '@foscia/shared';

/**
 * Create a transformer.
 *
 * @param deserializeFn
 * @param serializeFn
 *
 * @category Factories
 */
export default <T, DS, SR>(
  deserializeFn: (value: DS) => Awaitable<T>,
  serializeFn?: (value: T) => Awaitable<SR>,
) => ({
  deserialize: (value: Optional<DS>) => (isNil(value) ? null : deserializeFn(value)),
  serialize: (value: T | null) => (
    isNil(value)
      ? null
      : (serializeFn ?? deserializeFn)(value as any)
  ),
} as ObjectTransformer<T | null, Optional<DS>, SR | null>);
