import { PendingModelProp } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_PENDING } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

export default (
  value: unknown,
): value is PendingModelProp<any> => isFosciaType(value, SYMBOL_MODEL_PROP_PENDING);
