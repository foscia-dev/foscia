import { ModelComposable } from '@foscia/core/model/types';
import { SYMBOL_MODEL_COMPOSABLE } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

export default (
  value: unknown,
): value is ModelComposable => isFosciaType(value, SYMBOL_MODEL_COMPOSABLE);
