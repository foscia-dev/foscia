import { ModelRelation } from '@foscia/core/model/types';
import { SYMBOL_MODEL_RELATION_HAS_MANY } from '@foscia/core/symbols';

/**
 * Check if relation is plural.
 *
 * @param prop
 *
 * @internal
 */
export default (
  prop: ModelRelation,
): boolean => prop.$RELATION_KIND === SYMBOL_MODEL_RELATION_HAS_MANY;
