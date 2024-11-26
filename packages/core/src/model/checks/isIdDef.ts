import isValuePropDefOfType from '@foscia/core/model/checks/isValuePropDefOfType';
import { ModelId } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_ID } from '@foscia/core/symbols';

export default (
  value: unknown,
): value is ModelId => isValuePropDefOfType(value, SYMBOL_MODEL_PROP_KIND_ID);
