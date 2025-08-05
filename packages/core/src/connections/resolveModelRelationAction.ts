import resolveModelAction from '@foscia/core/connections/resolveModelAction';
import { ModelRelationProp } from '@foscia/core/models/types';
import resolveRelatedModels from '@foscia/core/relations/utilities/resolveRelatedModels';

/**
 * Resolve an action factory for a relation.
 *
 * @param relation
 *
 * @internal
 */
export default async function resolveModelRelationAction(relation: ModelRelationProp) {
  const models = await resolveRelatedModels(relation);

  return resolveModelAction(models[0]);
}
