import isValuePropDefOfType from '@foscia/core/model/checks/isValuePropDefOfType';
import { ModelRelation } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_RELATION } from '@foscia/core/symbols';

export default (
  value: unknown,
): value is ModelRelation => isValuePropDefOfType(value, SYMBOL_MODEL_PROP_KIND_RELATION);
