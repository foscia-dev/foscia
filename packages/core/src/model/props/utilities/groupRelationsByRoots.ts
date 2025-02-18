import { ModelInstance, ModelRelationDotKey, ModelRelationKey } from '@foscia/core/model/types';
import { tap, uniqueValues } from '@foscia/shared';

/**
 * Group relations by common roots.
 *
 * @param relations
 *
 * @internal
 */
export default <I extends ModelInstance>(
  relations: ModelRelationDotKey<I>[],
) => tap(new Map<ModelRelationKey<I>, string[]>(), (groups) => {
  relations.forEach((relation) => {
    const [rootRelation, ...subRelations] = relation.split('.');

    groups.set(rootRelation as ModelRelationKey<I>, uniqueValues([
      ...(groups.get(rootRelation as ModelRelationKey<I>) ?? []),
      ...subRelations,
    ]));
  });
});
