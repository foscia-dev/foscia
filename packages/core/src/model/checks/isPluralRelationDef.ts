import { ModelRelation } from '@foscia/core/model/types';
import { SYMBOL_MODEL_RELATION_HAS_MANY } from '@foscia/core/symbols';

/**
 * Check if relation definition is a plural relation.
 *
 * @param def
 *
 * @category Utilities
 */
export default (
  def: ModelRelation,
): boolean => def.$RELATION_TYPE === SYMBOL_MODEL_RELATION_HAS_MANY;
