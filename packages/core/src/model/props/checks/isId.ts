import isPropOfType from '@foscia/core/model/props/checks/isPropOfType';
import { ModelId } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_ID } from '@foscia/core/symbols';

/**
 * Check if value is an ID property.
 *
 * @param value
 *
 * @internal
 */
export default (
  value: unknown,
): value is ModelId => isPropOfType(value, SYMBOL_MODEL_PROP_KIND_ID);
