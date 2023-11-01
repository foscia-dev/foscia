import { ModelAttribute } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_ATTRIBUTE } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

export default function isAttributeDef(
  value: unknown,
): value is ModelAttribute<any> {
  return isFosciaType(value, SYMBOL_MODEL_PROP_ATTRIBUTE);
}
