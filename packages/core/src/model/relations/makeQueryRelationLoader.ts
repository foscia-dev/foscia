import { all, include, one, query, when } from '@foscia/core/actions';
import { ActionFactory, ConsumeAdapter, ConsumeDeserializer } from '@foscia/core/actions/types';
import logger from '@foscia/core/logger/logger';
import isPluralRelationDef from '@foscia/core/model/checks/isPluralRelationDef';
import groupRelationsByRoots from '@foscia/core/model/relations/utilities/groupRelationsByRoots';
import loadUsingCallback from '@foscia/core/model/relations/utilities/loadUsingCallback';
import loadUsingValue from '@foscia/core/model/relations/utilities/loadUsingValue';
import shouldExcludeInstanceAndRelation
  from '@foscia/core/model/relations/utilities/shouldExcludeInstanceAndRelation';
import { ModelInstance, ModelRelationDotKey, ModelRelationKey } from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { Arrayable, ArrayableVariadic } from '@foscia/shared';

type QueryRelationLoaderOptions = {
  exclude?: <I extends ModelInstance>(instance: I, relation: ModelRelationDotKey<I>) => boolean;
  disablePerformanceWarning?: boolean;
};

export default <
  RawData,
  Data,
  Deserialized extends DeserializedData,
  C extends ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>,
>(
  action: ActionFactory<[], C, {}>,
  options: QueryRelationLoaderOptions = {},
) => async <I extends ModelInstance>(
  instances: Arrayable<I>,
  ...relations: ArrayableVariadic<ModelRelationDotKey<I>>
) => loadUsingCallback(instances, relations, async (allInstances, allRelations) => {
  const groupedRelations = groupRelationsByRoots(allRelations);
  const actionsCount = allInstances.length * groupedRelations.size;
  if (!options.disablePerformanceWarning && actionsCount > 1) {
    logger.warn(
      `Loading \`${groupedRelations.size}\` relations on \`${allInstances.length}\` instances using \`makeQueryRelationLoader\` is not recommended, as this will execute ${actionsCount} actions and may cause performance issues. You can disable this warning by passing \`disablePerformanceWarning\` option to your loader factory.`,
    );
  }

  await Promise.all(allInstances.map(async (instance) => {
    await Promise.all([...groupedRelations.entries()].map(async ([relation, nested]) => {
      if (
        options.exclude
        && shouldExcludeInstanceAndRelation(instance, relation, nested, options.exclude)
      ) {
        return;
      }

      const def = instance.$model.$schema[relation];
      const isPlural = isPluralRelationDef(def);

      const value = await action()
        .use(query(instance, relation), include(nested as any))
        .run(when(isPlural, all(), one()));

      loadUsingValue(instance, relation as ModelRelationKey<I>, value as any);
    }));
  }));
});
