import { ModelId } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_ID } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

export default function isIdDef(
  value: unknown,
): value is ModelId<any> {
  return isFosciaType(value, SYMBOL_MODEL_PROP_ID);
}
