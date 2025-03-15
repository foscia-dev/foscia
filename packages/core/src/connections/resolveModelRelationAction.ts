import consumeRegistry from '@foscia/core/actions/context/consumers/consumeRegistry';
import resolveModelAction from '@foscia/core/connections/resolveModelAction';
import FosciaError from '@foscia/core/errors/fosciaError';
import { ModelRelation } from '@foscia/core/model/types';
import resolveRelatedModels from '@foscia/core/relations/utilities/resolveRelatedModels';

/**
 * Resolve the action factory for a relation targeted model.
 *
 * @param relation
 *
 * @category Utilities
 * @internal
 */
export default async (relation: ModelRelation) => {
  const models = await resolveRelatedModels(
    relation,
    await consumeRegistry(resolveModelAction(relation.parent)(), null),
  );
  if (models.length) {
    return resolveModelAction(models[0]);
  }

  throw new FosciaError(
    `Connection for relation \`${relation.parent.$type}.${relation.key}\` could not be determined.`,
  );
};
