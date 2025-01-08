import { ModelInstance } from '@foscia/core/model/types';
import { SYMBOL_MODEL_INSTANCE } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

/**
 * Check if value is a model instance.
 *
 * @param value
 *
 * @category Utilities
 */
export default <I extends ModelInstance = ModelInstance>(
  value: unknown,
): value is I => isFosciaType(value, SYMBOL_MODEL_INSTANCE);
