import isPropOfType from '@foscia/core/models/old/props/checks/isPropOfType';
import { ModelRelation } from '@foscia/core/models/oldTypes';
import { SYMBOL_MODEL_PROP_RELATION } from '@foscia/core/symbols';

/**
 * Check if value is a relation.
 *
 * @param value
 *
 * @internal
 */
export default (
  value: unknown,
): value is ModelRelation => isPropOfType(value, SYMBOL_MODEL_PROP_RELATION);
