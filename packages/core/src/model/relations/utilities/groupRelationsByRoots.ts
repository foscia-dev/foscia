import { ModelInstance, ModelRelationDotKey, ModelRelationKey } from '@foscia/core/model/types';
import { uniqueValues } from '@foscia/shared';

export default <I extends ModelInstance>(
  relations: ModelRelationDotKey<I>[],
) => {
  const groups = new Map<ModelRelationKey<I>, string[]>();

  relations.forEach((relation) => {
    const [rootRelation, ...subRelations] = relation.split('.');

    groups.set(rootRelation as ModelRelationKey<I>, uniqueValues([
      ...(groups.get(rootRelation as ModelRelationKey<I>) ?? []),
      ...subRelations,
    ]));
  });

  return groups;
};
