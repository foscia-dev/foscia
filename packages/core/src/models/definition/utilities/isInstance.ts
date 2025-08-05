import { ModelInstance } from '@foscia/core/models/types';
import { SYMBOL_MODEL_INSTANCE } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared/index';

/**
 * Check if value is a model instance.
 *
 * @param value
 *
 * @category Utilities
 */
export default function isInstance<I extends ModelInstance = ModelInstance>(
  value: unknown,
): value is I {
  return isFosciaType(value, SYMBOL_MODEL_INSTANCE);
}
