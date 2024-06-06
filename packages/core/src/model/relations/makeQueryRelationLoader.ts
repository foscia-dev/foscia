import { all, include, one, query, when } from '@foscia/core/actions';
import { ActionFactory, ConsumeAdapter, ConsumeDeserializer } from '@foscia/core/actions/types';
import logger from '@foscia/core/logger/logger';
import isPluralRelationDef from '@foscia/core/model/checks/isPluralRelationDef';
import loadUsingCallback from '@foscia/core/model/relations/loadUsingCallback';
import loadUsingValue from '@foscia/core/model/relations/loadUsingValue';
import { ModelInstance, ModelRelationDotKey, ModelRelationKey } from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { Arrayable, ArrayableVariadic, wrap } from '@foscia/shared';

type QueryRelationLoaderOptions = {
  exclude?: <I extends ModelInstance>(instance: I, relation: ModelRelationDotKey<I>) => boolean;
  disablePerformanceWarning?: boolean;
};

export default function makeQueryRelationLoader<
  RawData,
  Data,
  Deserialized extends DeserializedData,
  C extends ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>,
>(action: ActionFactory<[], C, any>, options: QueryRelationLoaderOptions = {}) {
  return async <I extends ModelInstance>(
    instances: Arrayable<I>,
    ...relations: ArrayableVariadic<ModelRelationDotKey<I>>
  ) => loadUsingCallback(instances, relations, async (allInstances, allRelations) => {
    const actionsCount = allInstances.length * allRelations.length;
    if (!options.disablePerformanceWarning && actionsCount > 1) {
      logger.warn(
        `Loading \`${allRelations.length}\` relations on \`${allInstances.length}\` instances using \`makeQueryRelationLoader\` is not recommended, as this will execute ${actionsCount} actions and may cause performance issues. You can disable this warning by passing \`disablePerformanceWarning\` option to your loader factory.`,
      );
    }

    await Promise.all(wrap(instances).map(async (instance) => {
      await Promise.all(allRelations.map(async (relation) => {
        if (options.exclude && options.exclude(instance, relation)) {
          return;
        }

        const [rootRelation, ...subRelations] = relation.split('.');
        const def = instance.$model.$schema[rootRelation];
        const isPlural = isPluralRelationDef(def);

        const value = await action()
          .use(query(instance, rootRelation), include(subRelations as any))
          .run(when(isPlural, all(), one()));

        loadUsingValue(instance, rootRelation as ModelRelationKey<I>, value as any);
      }));
    }));
  });
}
