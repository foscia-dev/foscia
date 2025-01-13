import { SYMBOL_MODEL_PROP_TRANSFORMER } from '@foscia/core/symbols';
import { Awaitable, FosciaObject, Transformer } from '@foscia/shared';

/**
 * Bi-directional object transformer.
 */
export type ObjectTransformer<T, DS = unknown, SR = unknown> =
  & {
    deserialize: Transformer<DS, Awaitable<T>>;
    serialize: Transformer<T, Awaitable<SR>>;
  }
  & FosciaObject<typeof SYMBOL_MODEL_PROP_TRANSFORMER>;
