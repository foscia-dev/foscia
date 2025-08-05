import { ModelRelation } from '@foscia/core/models/oldTypes';
import {
  SYMBOL_MODEL_RELATION_HAS_MANY,
  SYMBOL_MODEL_RELATION_MORPH_MANY,
} from '@foscia/core/symbols';

/**
 * Check if relation is plural.
 *
 * @param prop
 *
 * @internal
 */
export default (
  prop: ModelRelation,
): boolean => prop.$RELATION_KIND === SYMBOL_MODEL_RELATION_HAS_MANY
  || prop.$RELATION_KIND === SYMBOL_MODEL_RELATION_MORPH_MANY;
