import { ModelInstance } from '@foscia/core/model/types';
import { SYMBOL_MODEL_INSTANCE } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

export default <I extends ModelInstance = ModelInstance>(
  value: unknown,
): value is I => isFosciaType(value, SYMBOL_MODEL_INSTANCE);
