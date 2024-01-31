import { all, one, query, when } from '@foscia/core/actions';
import { ActionFactory, ConsumeAdapter, ConsumeDeserializer } from '@foscia/core/actions/types';
import logger from '@foscia/core/logger/logger';
import isPluralRelationDef from '@foscia/core/model/checks/isPluralRelationDef';
import loadUsingValue from '@foscia/core/model/relations/loadUsingValue';
import { ModelInstance, ModelRelationKey } from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { Arrayable, ArrayableVariadic, wrap, wrapVariadic } from '@foscia/shared';

type QueryRelationLoaderOptions = {
  disablePerformanceWarning?: boolean;
};

export default function makeQueryRelationLoader<
  RawData,
  Data,
  Deserialized extends DeserializedData,
  C extends ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>,
>(action: ActionFactory<[], C, any>, options: QueryRelationLoaderOptions) {
  return async <I extends ModelInstance>(
    instances: Arrayable<I>,
    ...relations: ArrayableVariadic<ModelRelationKey<I>>
  ) => {
    const allInstances = wrap(instances);
    const allRelations = wrapVariadic(...relations);
    if (!allRelations.length || !allRelations.length) {
      return;
    }

    const actionsCount = allInstances.length * allRelations.length;
    if (!options.disablePerformanceWarning && actionsCount > 1) {
      logger.warn(
        `Loading \`${allRelations.length}\` relations on \`${allInstances.length}\` instances using \`makeQueryRelationLoader\` is not recommended, as this will execute ${actionsCount} actions and may cause performance issues. You can disable this warning by passing \`disablePerformanceWarning\` option to your loader factory.`,
      );
    }

    await Promise.all(wrap(instances).map(async (instance) => {
      await Promise.all(allRelations.map(async (relation) => {
        const def = instance.$model.$schema[relation];
        const isPlural = isPluralRelationDef(def);

        const value = await action()
          .use(query(instance, relation))
          .run(when(isPlural, all(), one()));

        loadUsingValue(instance, relation, value as any);
      }));
    }));
  };
}
