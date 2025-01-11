import isPropDefOfType from '@foscia/core/model/checks/isPropDefOfType';
import { ModelId } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_ID } from '@foscia/core/symbols';

/**
 * Check if value is an ID definition.
 *
 * @param value
 *
 * @category Utilities
 */
export default (
  value: unknown,
): value is ModelId => isPropDefOfType(value, SYMBOL_MODEL_PROP_KIND_ID);
