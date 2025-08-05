import { ModelProp } from '@foscia/core/models/types';
import { SYMBOL_MODEL_PROP } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared/index';

/**
 * Check if value is a model property.
 *
 * @param value
 *
 * @category Utilities
 */
export default function isModelProp<P extends ModelProp>(
  value: unknown,
): value is P {
  return isFosciaType(value, SYMBOL_MODEL_PROP);
}
