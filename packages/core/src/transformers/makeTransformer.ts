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
) => {
  const deserialize = deserializeFn;
  const serialize = serializeFn ?? deserializeFn;

  return {
    deserialize: (value: Optional<DS>) => (isNil(value) ? null : deserialize(value)),
    serialize: (value: T | null) => (isNil(value) ? null : serialize(value as any)),
  } as ObjectTransformer<T | null, Optional<DS>, SR | null>;
};
