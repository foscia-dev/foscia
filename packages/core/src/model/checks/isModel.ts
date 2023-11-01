import { Model, ModelClass } from '@foscia/core/model/types';
import { SYMBOL_MODEL_CLASS } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

export default function isModel<M extends ModelClass | Model>(
  value: unknown,
): value is M {
  return isFosciaType(value, SYMBOL_MODEL_CLASS);
}
