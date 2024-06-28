import { Model, ModelClass } from '@foscia/core/model/types';
import { SYMBOL_MODEL_CLASS } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

export default <M extends ModelClass | Model>(
  value: unknown,
): value is M => isFosciaType(value, SYMBOL_MODEL_CLASS);
