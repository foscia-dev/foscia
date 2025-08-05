import { ModelComposableFactory } from '@foscia/core/models/oldTypes';
import { SYMBOL_MODEL_COMPOSABLE } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

/**
 * Check if value is a composable.
 *
 * @param value
 *
 * @category Utilities
 */
export default (
  value: unknown,
): value is ModelComposableFactory => isFosciaType(value, SYMBOL_MODEL_COMPOSABLE);
