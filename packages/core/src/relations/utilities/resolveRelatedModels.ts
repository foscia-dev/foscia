import guessRelationType from '@foscia/core/relations/utilities/guessRelationType';
import { ModelRelation } from '@foscia/core/model/types';
import { ModelsRegistry } from '@foscia/core/types';
import { wrap } from '@foscia/shared';

/**
 * Resolve related models for a relation.
 *
 * @param relation
 * @param registry
 *
 * @category Utilities
 * @internal
 */
export default async (
  relation: ModelRelation,
  registry?: ModelsRegistry | null,
) => {
  if (relation.model) {
    return wrap(await relation.model());
  }

  const possibleTypes = wrap(
    relation.type ?? (
      relation.parent.$config.guessRelationType ?? guessRelationType
    )(relation),
  );
  if (registry && possibleTypes.length) {
    const possibleModels = await Promise.all(
      possibleTypes.map((type) => registry.resolve(type)),
    );

    return possibleModels.filter((m) => !!m);
  }

  return [];
};
