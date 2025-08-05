import isPropOfType from '@foscia/core/models/old/props/checks/isPropOfType';
import { ModelId } from '@foscia/core/models/oldTypes';
import { SYMBOL_MODEL_PROP_ID } from '@foscia/core/symbols';

/**
 * Check if value is an ID property.
 *
 * @param value
 *
 * @internal
 */
export default (
  value: unknown,
): value is ModelId => isPropOfType(value, SYMBOL_MODEL_PROP_ID);
