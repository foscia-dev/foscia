import isValuePropDefOfType from '@foscia/core/model/checks/isValuePropDefOfType';
import { ModelAttribute } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_ATTRIBUTE } from '@foscia/core/symbols';

export default (
  value: unknown,
): value is ModelAttribute => isValuePropDefOfType(value, SYMBOL_MODEL_PROP_KIND_ATTRIBUTE);
