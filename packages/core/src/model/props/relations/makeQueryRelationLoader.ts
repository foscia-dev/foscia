import { all, include, one, query, when } from '@foscia/core/actions';
import { ActionFactory, ConsumeAdapter, ConsumeDeserializer } from '@foscia/core/actions/types';
import logger from '@foscia/core/logger/logger';
import isPluralRelationDef from '@foscia/core/model/props/checks/isPluralRelationDef';
import groupRelationsByRoots from '@foscia/core/model/props/utilities/groupRelationsByRoots';
import loadUsingCallback from '@foscia/core/model/props/utilities/loadUsingCallback';
import loadUsingValue from '@foscia/core/model/props/utilities/loadUsingValue';
import shouldExcludeInstanceAndRelation
  from '@foscia/core/model/props/utilities/shouldExcludeInstanceAndRelation';
import {
  ModelInstance,
  ModelRelation,
  ModelRelationDotKey,
  ModelRelationKey,
} from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { Arrayable, ArrayableVariadic } from '@foscia/shared';

/**
 * Configuration for the {@link makeQueryRelationLoader | `makeQueryRelationLoader`} factory.
 *
 * @internal
 */
export type QueryRelationLoaderOptions = {
  /**
   * Determine if the given instance relation should be ignored from
   * refresh.
   * As an example, this can be used to load only missing relations.
   *
   * @param instance
   * @param relation
   *
   * @example
   * ```typescript
   * import { makeQueryRelationLoader, loaded } from '@foscia/core';
   *
   * export default makeQueryRelationLoader(action, {
   *   exclude: loaded,
   * });
   * ```
   */
  exclude?: <I extends ModelInstance>(instance: I, relation: ModelRelationDotKey<I>) => boolean;
  /**
   * Disable the performance warning log when more than one action
   * will run.
   *
   * @example
   * ```typescript
   * import { makeQueryRelationLoader, loaded } from '@foscia/core';
   *
   * export default makeQueryRelationLoader(action, {
   *   disablePerformanceWarning: true,
   * });
   * ```
   */
  disablePerformanceWarning?: boolean;
};

/**
 * Create a relations loader querying related model through the current
 * instance relation.
 *
 * @param action
 * @param options
 *
 * @category Factories
 *
 * @example
 * ```typescript
 * import { makeQueryRelationLoader } from '@foscia/core';
 *
 * export default makeQueryRelationLoader(action);
 * ```
 */
export default <
  RawData,
  Data,
  Deserialized extends DeserializedData,
  C extends ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>,
>(
  action: ActionFactory<C>,
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

      const def = instance.$model.$schema[relation] as ModelRelation;
      const isPlural = isPluralRelationDef(def);

      const value = await action(
        query(instance, relation),
        include(nested as any),
        when(isPlural, all(), one()),
      );

      loadUsingValue(instance, relation as ModelRelationKey<I>, value as any);
    }));
  }));
});
