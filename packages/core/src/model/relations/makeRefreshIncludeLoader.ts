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
import loadUsingCallback from '@foscia/core/model/relations/loadUsingCallback';
import loadUsingValue from '@foscia/core/model/relations/loadUsingValue';
import {
  Model,
  ModelIdType,
  ModelInstance,
  ModelRelationDotKey,
  ModelRelationKey,
} from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { Arrayable, ArrayableVariadic, Awaitable, uniqueValues } from '@foscia/shared';

type RefreshIncludeLoaderOptions<
  RawData,
  Data,
  Deserialized extends DeserializedData,
  C extends ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>,
> = {
  prepare?: (
    action: Action<C & ConsumeModel>,
    context: { instances: ModelInstance[]; relations: string[] },
  ) => Awaitable<unknown>;
  chunk?: (instances: ModelInstance[]) => ModelInstance[][];
  exclude?: <I extends ModelInstance>(instance: I, relation: ModelRelationDotKey<I>) => boolean;
};

function excludeInstancesAndRelations<I extends ModelInstance>(
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

async function refreshLoad<
  RawData,
  Data,
  Deserialized extends DeserializedData,
  C extends ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>,
  I extends ModelInstance,
>(
  action: ActionFactory<[], C, {}>,
  options: RefreshIncludeLoaderOptions<RawData, Data, Deserialized, C>,
  instances: I[],
  relations: ModelRelationDotKey<I>[],
) {
  const model = instances[0].$model;
  const refreshedInstances = await action()
    .use(query(model as Model))
    .use(include(relations as any))
    .use(when(() => options.prepare, async (a, p) => {
      await p(a as Action<C & ConsumeModel>, { instances, relations });
    }))
    .run(all());

  const refreshedInstancesMap = refreshedInstances.reduce((instancesMap, instance) => ({
    ...instancesMap,
    [instance.id as ModelIdType]: instance,
  }), {} as Record<ModelIdType, I>);
  const relationRootKeys = uniqueValues(relations.map(
    (relation) => relation.split('.')[0],
  )) as ModelRelationKey<I>[];

  instances.forEach((instance) => {
    const refreshedInstance = refreshedInstancesMap[instance.id];
    if (!refreshedInstance) {
      logger.warn(`Loading relations of instance with ID \`${instance.id}\` did not work, instance was not found in refreshed list.`);

      return;
    }

    relationRootKeys.forEach((relation) => {
      loadUsingValue(instance, relation, refreshedInstance[relation]);
    });
  });
}

export default function makeRefreshIncludeLoader<
  RawData,
  Data,
  Deserialized extends DeserializedData,
  C extends ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>,
>(
  action: ActionFactory<[], C, {}>,
  options: RefreshIncludeLoaderOptions<RawData, Data, Deserialized, C> = {},
) {
  return async <I extends ModelInstance>(
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
}
