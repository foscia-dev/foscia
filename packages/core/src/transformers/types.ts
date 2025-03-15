import { SYMBOL_MODEL_PROP_TRANSFORMER } from '@foscia/core/symbols';
import { Awaitable, FosciaObject } from '@foscia/shared';

/**
 * Bi-directional object transformer.
 *
 * @internal
 */
export type ObjectTransformer<T, DS = unknown, SR = unknown> =
  & {
    deserialize: (value: DS) => Awaitable<T>;
    serialize: (value: T) => Awaitable<SR>;
  }
  & FosciaObject<typeof SYMBOL_MODEL_PROP_TRANSFORMER>;
