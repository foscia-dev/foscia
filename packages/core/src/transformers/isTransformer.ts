import { SYMBOL_MODEL_PROP_TRANSFORMER } from '@foscia/core/symbols';
import { ObjectTransformer } from '@foscia/core/transformers/types';
import { isFosciaType } from '@foscia/shared';

/**
 * Check if given value is a transformer object.
 *
 * @param value
 *
 * @internal
 */
export default <T = unknown, DS = unknown, SR = unknown>(
  value: unknown,
): value is ObjectTransformer<T, DS, SR> => isFosciaType(value, SYMBOL_MODEL_PROP_TRANSFORMER);
