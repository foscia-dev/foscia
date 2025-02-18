import isPropDefOfType from '@foscia/core/model/props/checks/isPropDefOfType';
import { ModelAttribute } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_ATTRIBUTE } from '@foscia/core/symbols';

/**
 * Check if value is an attribute definition.
 *
 * @param value
 *
 * @internal
 */
export default (
  value: unknown,
): value is ModelAttribute => isPropDefOfType(value, SYMBOL_MODEL_PROP_KIND_ATTRIBUTE);
