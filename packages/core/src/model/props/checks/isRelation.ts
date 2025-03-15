import isPropOfType from '@foscia/core/model/props/checks/isPropOfType';
import { ModelRelation } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_RELATION } from '@foscia/core/symbols';

/**
 * Check if value is a relation.
 *
 * @param value
 *
 * @internal
 */
export default (
  value: unknown,
): value is ModelRelation => isPropOfType(value, SYMBOL_MODEL_PROP_KIND_RELATION);
