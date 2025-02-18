import isPropDefOfType from '@foscia/core/model/props/checks/isPropDefOfType';
import { ModelRelation } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_RELATION } from '@foscia/core/symbols';

/**
 * Check if value is a relation definition.
 *
 * @param value
 *
 * @internal
 */
export default (
  value: unknown,
): value is ModelRelation => isPropDefOfType(value, SYMBOL_MODEL_PROP_KIND_RELATION);
