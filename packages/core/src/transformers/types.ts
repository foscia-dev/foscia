import { SYMBOL_MODEL_PROP_TRANSFORMER } from '@foscia/core/symbols';
import { Awaitable, FosciaObject } from '@foscia/shared';

/**
 * Bi-directional object transformer.
 *
 * @internal
 */
export interface ObjectTransformer<
  T,
  Deserialized = unknown,
  Serialized = unknown,
> extends FosciaObject<typeof SYMBOL_MODEL_PROP_TRANSFORMER> {
  deserialize: (value: Deserialized) => Awaitable<T>;
  serialize: (value: T) => Awaitable<Serialized>;
}
