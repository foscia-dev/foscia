import { ObjectTransformer } from '@foscia/core/transformers/types';
import { Awaitable, isNil, Optional } from '@foscia/shared';

export default function makeTransformer<T, DS, SR>(
  deserializeFn: (value: DS) => Awaitable<T>,
  serializeFn?: (value: T) => Awaitable<SR>,
) {
  const deserialize = deserializeFn;
  const serialize = serializeFn ?? deserializeFn;

  return {
    deserialize: (value: Optional<DS>) => (isNil(value) ? null : deserialize(value)),
    serialize: (value: T | null) => (isNil(value) ? null : serialize(value as any)),
  } as ObjectTransformer<T | null, Optional<DS>, SR | null>;
}
