import { ModelInstance, ModelRelationDotKey } from '@foscia/core/model/types';

/**
 * Exclude instances and relations depending on a predicate.
 *
 * @param instances
 * @param relations
 * @param exclude
 *
 * @internal
 */
export default <I extends ModelInstance>(
  instances: I[],
  relations: ModelRelationDotKey<I>[],
  exclude: (instance: I, relation: ModelRelationDotKey<I>) => boolean,
) => {
  const remainingInstances = new Set<I>();
  const remainingRelations = new Set<ModelRelationDotKey<I>>();

  relations.forEach((relation) => {
    instances.forEach((instance) => {
      if (!exclude(instance, relation)) {
        remainingInstances.add(instance);
        remainingRelations.add(relation);
      }
    });
  });

  return [
    [...remainingInstances.values()],
    [...remainingRelations.values()],
  ] as [I[], ModelRelationDotKey<I>[]];
};
