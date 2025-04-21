import isPluralRelation from '@foscia/core/relations/checks/isPluralRelation';
import { ModelRelation } from '@foscia/core/model/types';

/**
 * Check if relation is singular.
 *
 * @param prop
 *
 * @internal
 */
export default (
  prop: ModelRelation,
) => !isPluralRelation(prop);
