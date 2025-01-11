import isPluralRelationDef from '@foscia/core/model/checks/isPluralRelationDef';
import { ModelRelation } from '@foscia/core/model/types';

/**
 * Check if relation definition is a singular relation.
 *
 * @param def
 *
 * @category Utilities
 */
export default (
  def: ModelRelation,
) => !isPluralRelationDef(def);
