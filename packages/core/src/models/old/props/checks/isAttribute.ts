import isPropOfType from '@foscia/core/models/old/props/checks/isPropOfType';
import { ModelAttribute } from '@foscia/core/models/oldTypes';
import { SYMBOL_MODEL_PROP_ATTRIBUTE } from '@foscia/core/symbols';

/**
 * Check if value is an attribute property.
 *
 * @param value
 *
 * @internal
 */
export default (
  value: unknown,
): value is ModelAttribute => isPropOfType(value, SYMBOL_MODEL_PROP_ATTRIBUTE);
