import isPluralRelationDef from '@foscia/core/model/props/checks/isPluralRelationDef';
import { ModelRelation } from '@foscia/core/model/types';

/**
 * Check if relation definition is a singular relation.
 *
 * @param def
 *
 * @internal
 */
export default (
  def: ModelRelation,
) => !isPluralRelationDef(def);
