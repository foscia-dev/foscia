import makeCustomTransformer from '@foscia/core/transformers/makeCustomTransformer';
import { ObjectTransformer } from '@foscia/core/transformers/types';
import { Awaitable, isNil } from '@foscia/shared';

/**
 * Create a transformer with automatic support for `null`
 * or `undefined` values.
 *
 * @param deserialize
 * @param serialize
 *
 * @category Factories
 */
export default function makeTransformer<T, Deserialized, Serialized>(
  deserialize: (value: Deserialized) => Awaitable<T>,
  serialize?: (value: T) => Awaitable<Serialized>,
) {
  return makeCustomTransformer(
    (value: Deserialized | null | undefined) => (isNil(value) ? null : deserialize(value)),
    (value: T | null) => (
      isNil(value)
        ? null
        : (serialize ?? deserialize)(value as any)
    ),
  ) as ObjectTransformer<T | null, Deserialized | null | undefined, Serialized | null>;
}
