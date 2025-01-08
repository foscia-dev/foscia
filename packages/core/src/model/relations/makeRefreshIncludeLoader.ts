import { all, include, when } from '@foscia/core/actions';
import query from '@foscia/core/actions/context/enhancers/query';
import {
  Action,
  ActionFactory,
  ConsumeAdapter,
  ConsumeDeserializer,
  ConsumeModel,
} from '@foscia/core/actions/types';
import logger from '@foscia/core/logger/logger';
import excludeInstancesAndRelations
  from '@foscia/core/model/relations/utilities/excludeInstancesAndRelations';
import loadUsingCallback from '@foscia/core/model/relations/utilities/loadUsingCallback';
import loadUsingValue from '@foscia/core/model/relations/utilities/loadUsingValue';
import {
  Model,
  ModelIdType,
  ModelInstance,
  ModelRelationDotKey,
  ModelRelationKey,
} from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { Arrayable, ArrayableVariadic, Awaitable, mapWithKeys, uniqueValues } from '@foscia/shared';

/**
 * Configuration for the {@link makeRefreshIncludeLoader | `makeRefreshIncludeLoader`} factory.
 *
 * @internal
 */
export type RefreshIncludeLoaderOptions<
  RawData,
  Data,
  Deserialized extends DeserializedData,
  C extends ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>,
> = {
  /**
   * Prepare the action using the given context.
   * As an example, this can be used to filter the query on instances IDs.
   *
   * @param action
   * @param context
   *
   * @example
   * ```typescript
   * import { makeRefreshIncludeLoader } from '@foscia/core';
   * import { filterBy } from '@foscia/jsonapi';
   *
   * export default makeRefreshIncludeLoader(action, {
   *   prepare: (a, { instances }) => a.use(filterBy({ ids: instances.map((i) => i.id) })),
   * });
   * ```
   */
  prepare?: (
    action: Action<C & ConsumeModel>,
    context: { instances: ModelInstance[]; relations: string[] },
  ) => Awaitable<unknown>;
  /**
   * Chunk the instances array into multiple arrays to make multiple queries
   * instead of a unique one.
   * As an example, this can be used to avoid hitting pagination limit of an API.
   *
   * @param instances
   *
   * @example
   * ```typescript
   * import { makeRefreshIncludeLoader } from '@foscia/core';
   *
   * const chunk = <T>(items: T[], size: number) => {
   *   const chunks = [] as T[][];
   *   for (let i = 0; i < array.length; i += size) {
   *     chunks.push(array.slice(i, i + chunkSize));
   *   }
   *
   *   return chunks;
   * };
   *
   * export default makeRefreshIncludeLoader(action, {
   *   chunk: (instances) => chunk(instances, 20),
   * });
   * ```
   */
  chunk?: (instances: ModelInstance[]) => ModelInstance[][];
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
   * import { makeRefreshIncludeLoader, loaded } from '@foscia/core';
   *
   * export default makeRefreshIncludeLoader(action, {
   *   exclude: loaded,
   * });
   * ```
   */
  exclude?: <I extends ModelInstance>(instance: I, relation: ModelRelationDotKey<I>) => boolean;
};

const refreshLoad = async <
  RawData,
  Data,
  Deserialized extends DeserializedData,
  C extends ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>,
  I extends ModelInstance,
>(
  action: ActionFactory<[], C>,
  options: RefreshIncludeLoaderOptions<RawData, Data, Deserialized, C>,
  instances: I[],
  relations: ModelRelationDotKey<I>[],
) => {
  const model = instances[0].$model;
  const refreshedInstances = await action()
    .use(query(model as Model))
    .use(include(relations as any))
    .use(when(() => options.prepare, async (a, p) => {
      await p(a as Action<C & ConsumeModel>, { instances, relations });
    }))
    .run(all());

  const refreshedInstancesMap = mapWithKeys(refreshedInstances, (instance) => ({
    [instance.id as ModelIdType]: instance,
  })) as Record<ModelIdType, I>;
  const relationRootKeys = uniqueValues(relations.map(
    (relation) => relation.split('.')[0],
  )) as ModelRelationKey<I>[];

  instances.forEach((instance) => {
    const refreshedInstance = refreshedInstancesMap[instance.id];
    if (!refreshedInstance) {
      logger.warn(
        `Loading relations of instance with ID \`${instance.$model.$type}:${instance.id}\` did not work, instance was not found in refreshed results.`,
      );

      return;
    }

    relationRootKeys.forEach((relation) => {
      loadUsingValue(instance, relation, refreshedInstance[relation]);
    });
  });
};

/**
 * Create a relations loader refreshing the instances while including
 * missing relations.
 *
 * @param action
 * @param options
 *
 * @category Factories
 *
 * @example
 * ```typescript
 * import { makeRefreshIncludeLoader } from '@foscia/core';
 * import { filterBy } from '@foscia/jsonapi';
 *
 * export default makeRefreshIncludeLoader(action, {
 *   prepare: (a, { instances }) => a.use(filterBy({ ids: instances.map((i) => i.id) })),
 * });
 * ```
 */
export default <
  RawData,
  Data,
  Deserialized extends DeserializedData,
  C extends ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>,
>(
  action: ActionFactory<[], C>,
  options: RefreshIncludeLoaderOptions<RawData, Data, Deserialized, C> = {},
) => async <I extends ModelInstance>(
  instances: Arrayable<I>,
  ...relations: ArrayableVariadic<ModelRelationDotKey<I>>
) => loadUsingCallback(instances, relations, async (allInstances, allRelations) => {
  let remainingInstances = allInstances;
  let remainingRelations = allRelations;
  if (options.exclude) {
    [remainingInstances, remainingRelations] = excludeInstancesAndRelations(
      allInstances,
      allRelations,
      options.exclude,
    );
  }

  const chunk = (options.chunk ?? ((i) => [i])) as (instances: I[]) => I[][];

  await Promise.all(chunk(remainingInstances).map(async (chunkInstances) => {
    await refreshLoad(action, options, chunkInstances, remainingRelations);
  }));
});
