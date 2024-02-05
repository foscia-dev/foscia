import { ModelComposable } from '@foscia/core/model/types';
import { SYMBOL_MODEL_COMPOSABLE } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

export default function isComposable(
  value: unknown,
): value is ModelComposable {
  return isFosciaType(value, SYMBOL_MODEL_COMPOSABLE);
}
