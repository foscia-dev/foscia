import { Model } from '@foscia/core/model/types';
import { SYMBOL_MODEL_CLASS } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

/**
 * Check if value is a model.
 *
 * @param value
 *
 * @category Utilities
 */
export default <M extends Model>(
  value: unknown,
): value is M => isFosciaType(value, SYMBOL_MODEL_CLASS);
