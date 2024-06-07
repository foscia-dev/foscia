import { ModelInstance, ModelRelationDotKey } from '@foscia/core/model/types';

export default function excludeInstancesAndRelations<I extends ModelInstance>(
  instances: I[],
  relations: ModelRelationDotKey<I>[],
  exclude: (instance: I, relation: ModelRelationDotKey<I>) => boolean,
) {
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
}
