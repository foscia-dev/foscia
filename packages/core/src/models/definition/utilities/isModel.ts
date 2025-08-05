import { Model } from '@foscia/core/models/types';
import { SYMBOL_MODEL_CLASS } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared/index';

/**
 * Check if value is a model.
 *
 * @param value
 *
 * @category Utilities
 */
export default function isModel<M extends Model>(
  value: unknown,
): value is M {
  return isFosciaType(value, SYMBOL_MODEL_CLASS);
}
