import isPropOfType from '@foscia/core/model/props/checks/isPropOfType';
import { ModelAttribute } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_ATTRIBUTE } from '@foscia/core/symbols';

/**
 * Check if value is an attribute property.
 *
 * @param value
 *
 * @internal
 */
export default (
  value: unknown,
): value is ModelAttribute => isPropOfType(value, SYMBOL_MODEL_PROP_KIND_ATTRIBUTE);
