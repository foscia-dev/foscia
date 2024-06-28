import { ModelRelation } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_RELATION } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

export default (
  value: unknown,
): value is ModelRelation<any> => isFosciaType(value, SYMBOL_MODEL_PROP_RELATION);
