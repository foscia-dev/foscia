import { ModelInstance } from '@foscia/core/model/types';
import { SYMBOL_MODEL_INSTANCE } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

export default function isInstance<I extends ModelInstance = ModelInstance>(
  value: unknown,
): value is I {
  return isFosciaType(value, SYMBOL_MODEL_INSTANCE);
}
