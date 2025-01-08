import { ModelPropFactory } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_FACTORY } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

export default (
  value: unknown,
): value is ModelPropFactory => isFosciaType(value, SYMBOL_MODEL_PROP_FACTORY);
