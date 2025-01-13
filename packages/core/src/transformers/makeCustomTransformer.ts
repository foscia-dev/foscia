import { SYMBOL_MODEL_PROP_TRANSFORMER } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';
import { Awaitable } from '@foscia/shared';

/**
 * Create a custom transformer without automatic support for `null`
 * or `undefined` values.
 *
 * @param deserialize
 * @param serialize
 *
 * @category Factories
 */
export default <T, DS, SR>(
  deserialize: (value: DS) => Awaitable<T>,
  serialize: (value: T) => Awaitable<SR>,
) => ({
  $FOSCIA_TYPE: SYMBOL_MODEL_PROP_TRANSFORMER,
  deserialize,
  serialize,
} as ObjectTransformer<T, DS, SR>);
