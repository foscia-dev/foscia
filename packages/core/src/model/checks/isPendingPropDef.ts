import { PendingModelProp } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_PENDING } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

export default function isPendingPropDef(
  value: unknown,
): value is PendingModelProp<any> {
  return isFosciaType(value, SYMBOL_MODEL_PROP_PENDING);
}
