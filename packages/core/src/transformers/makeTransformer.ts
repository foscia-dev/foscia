import makeCustomTransformer from '@foscia/core/transformers/makeCustomTransformer';
import { ObjectTransformer } from '@foscia/core/transformers/types';
import { Awaitable, isNil, Optional } from '@foscia/shared';

/**
 * Create a transformer with automatic support for `null`
 * or `undefined` values.
 *
 * @param deserialize
 * @param serialize
 *
 * @category Factories
 */
export default <T, DS, SR>(
  deserialize: (value: DS) => Awaitable<T>,
  serialize?: (value: T) => Awaitable<SR>,
) => makeCustomTransformer(
  (value: Optional<DS>) => (isNil(value) ? null : deserialize(value)),
  (value: T | null) => (
    isNil(value)
      ? null
      : (serialize ?? deserialize)(value as any)
  ),
) as ObjectTransformer<T | null, Optional<DS>, SR | null>;
