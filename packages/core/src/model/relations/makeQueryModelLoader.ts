import { all, include, query, when } from '@foscia/core/actions';
import {
  Action,
  ActionFactory,
  ConsumeAdapter,
  ConsumeDeserializer,
  ConsumeModel,
} from '@foscia/core/actions/types';
import logger from '@foscia/core/logger/logger';
import makeQueryModelLoaderExtractor
  from '@foscia/core/model/relations/makeQueryModelLoaderExtractor';
import groupRelationsByModels from '@foscia/core/model/relations/utilities/groupRelationsByModels';
import groupRelationsByRoots from '@foscia/core/model/relations/utilities/groupRelationsByRoots';
import loadUsingCallback from '@foscia/core/model/relations/utilities/loadUsingCallback';
import loadUsingValue from '@foscia/core/model/relations/utilities/loadUsingValue';
import shouldExcludeInstanceAndRelation
  from '@foscia/core/model/relations/utilities/shouldExcludeInstanceAndRelation';
import {
  Model,
  ModelIdType,
  ModelInstance,
  ModelRelationDotKey,
  ModelRelationKey,
} from '@foscia/core/model/types';
import normalizeKey from '@foscia/core/normalization/normalizeKey';
import { DeserializedData } from '@foscia/core/types';
import {
  Arrayable,
  ArrayableVariadic,
  Awaitable,
  IdentifiersMap,
  isNil,
  makeIdentifiersMap,
  wrap,
} from '@foscia/shared';

type ExtractedId = { id: ModelIdType; type?: string; };

/**
 * Configuration for the {@link makeQueryModelLoader | `makeQueryModelLoader`} factory.
 *
 * @internal
 */
export type QueryModelLoaderOptions<
  RawData,
  Data,
  Deserialized extends DeserializedData,
  C extends ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>,
> = {
  /**
   * Extract the related ID(s) from an instance's relation.
   * You should use {@link makeQueryModelLoaderExtractor | `makeQueryModelLoaderExtractor`}
   * to create an extractor function. Defaults to using the `$raw` record object.
   *
   * @param instance
   * @param relation
   *
   * @example
   * The default implementation extract related IDs from `$raw` record object.
   * It supports record with IDs as relation values (`"comments": ["1", "2"]`)
   * and even polymorphic relations values with objects containing both `type` and `ID`
   * (`"comments": [{ "type": "comments", "id": "1" }, { "type": "comments", "id": "2" }]`).
   *
   * ```typescript
   * import { makeQueryModelLoader, makeQueryModelLoaderExtractor } from '@foscia/core';
   * import { filterBy } from '@foscia/jsonapi';
   *
   * export default makeQueryModelLoader(action, {
   *   extract: makeQueryModelLoaderExtractor(
   *     (instance, relation) => instance.$raw[normalizeKey(instance.$model, relation)],
   *     (value) => (
   *       typeof value === 'object' ? { id: value.id, type: value.type } : { id: value }
   *     ),
   *   ),
   * });
   * ```
   *
   * @remarks
   * Notice that Foscia will try to deserialize each relation were record is an object or array
   * of objects value. This will mark the relation as loaded even if the related value
   * attributes are not loaded. To avoid this, you can disable the relation's syncing on
   * pull (e.g. hasOne().sync('push')), as it will disable relation deserialization.
   * If you want a more global solution, you can update the `pullRelation` option on
   * your deserializer configuration.
   */
  extract?: <I extends ModelInstance>(
    instance: I,
    relation: ModelRelationKey<I>,
  ) => Arrayable<ExtractedId> | null | undefined;
  /**
   * Prepare the action using the given context.
   * As an example, this can be used to filter the query on instances IDs.
   *
   * @param action
   * @param context
   *
   * @example
   * ```typescript
   * import { makeQueryModelLoader } from '@foscia/core';
   * import { filterBy } from '@foscia/jsonapi';
   *
   * export default makeQueryModelLoader(action, {
   *   prepare: (a, { ids }) => a.use(filterBy({ ids })),
   * });
   * ```
   */
  prepare?: (
    action: Action<C & ConsumeModel>,
    context: { ids: ModelIdType[]; relations: string[] },
  ) => Awaitable<unknown>;
  /**
   * Chunk the IDs array into multiple arrays to make multiple queries
   * instead of a unique one.
   * As an example, this can be used to avoid hitting pagination limit of an API.
   *
   * @param ids
   *
   * @example
   * ```typescript
   * import { makeQueryModelLoader } from '@foscia/core';
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
   * export default makeQueryModelLoader(action, {
   *   chunk: (ids) => chunk(ids, 20),
   * });
   * ```
   */
  chunk?: (ids: ModelIdType[]) => ModelIdType[][];
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
   * import { makeQueryModelLoader, loaded } from '@foscia/core';
   *
   * export default makeQueryModelLoader(action, {
   *   exclude: loaded,
   * });
   * ```
   */
  exclude?: <I extends ModelInstance>(instance: I, relation: ModelRelationDotKey<I>) => boolean;
};

const extractIdsMap = <
  RawData,
  Data,
  Deserialized extends DeserializedData,
  C extends ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>,
  I extends ModelInstance,
>(
  options: QueryModelLoaderOptions<RawData, Data, Deserialized, C>,
  instances: I[],
  relations: Map<ModelRelationKey<I>, string[]>,
) => {
  const { exclude } = options;
  const extract = options.extract ?? makeQueryModelLoaderExtractor(
    (instance, relation) => instance.$raw[normalizeKey(instance.$model, relation)],
    (value) => (typeof value === 'object' ? { id: value.id, type: value.type } : { id: value }),
  );

  const extractedIdsMap = new Map<I, Map<ModelRelationKey<I>, Arrayable<ExtractedId> | null>>();
  instances.forEach((instance) => {
    if (exclude && [...relations.entries()].every(
      ([rootRelation, subRelations]) => shouldExcludeInstanceAndRelation(
        instance,
        rootRelation,
        subRelations,
        exclude,
      ),
    )) {
      return;
    }

    [...relations.keys()].forEach((rootRelation) => {
      const ids = extract(instance, rootRelation);
      if (ids !== undefined) {
        const extractedIdsForInstanceMap = extractedIdsMap.get(instance) ?? new Map();

        extractedIdsForInstanceMap.set(rootRelation, ids);
        extractedIdsMap.set(instance, extractedIdsForInstanceMap);
      }
    });
  });

  return extractedIdsMap;
};

const fetchRelatedMap = async <
  RawData,
  Data,
  Deserialized extends DeserializedData,
  C extends ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>,
  I extends ModelInstance,
>(
  action: ActionFactory<[], C>,
  options: QueryModelLoaderOptions<RawData, Data, Deserialized, C>,
  relations: Map<Model, { relations: ModelRelationKey<I>[]; nested: string[] }>,
  ids: Map<I, Map<ModelRelationKey<I>, Arrayable<ExtractedId> | null>>,
) => {
  const related = makeIdentifiersMap<string, ModelIdType, ModelInstance>();

  await Promise.all([...relations.entries()].map(async ([model, relationsData]) => {
    const targetedIds = [...ids.values()].reduce((allIds, idsForInstance) => {
      idsForInstance.forEach((extractedIds, relation) => {
        if (relationsData.relations.indexOf(relation) !== -1) {
          allIds.push(
            ...wrap(extractedIds)
              .filter(({ type }) => isNil(type) || type === model.$type),
          );
        }
      });

      return allIds;
    }, [] as ExtractedId[]);

    if (targetedIds.length) {
      const chunk = (options.chunk ?? ((i) => [i])) as (ids: ExtractedId[]) => ExtractedId[][];

      await Promise.all(chunk(targetedIds).map(async (chunkIds) => {
        const chunkRelated = await action()
          .use(query(model), include(relationsData.nested as any))
          .use(when(() => options.prepare, async (a, p) => {
            await p(a as Action<C & ConsumeModel>, {
              ids: chunkIds.map(({ id }) => id),
              relations: relationsData.nested,
            });
          }))
          .run(all());

        const chunkRelatedMap = new Map(chunkRelated.map((i) => [i.id, i]));

        chunkIds.forEach(({ type, id }) => {
          const instance = chunkRelatedMap.get(id);
          if (instance) {
            related.put(type ?? '', id, instance as any);
          } else {
            logger.warn(
              `Loading record for \`${model.$type}:${id}\` did not work, instance \`${id}\` was not found in results.`,
            );
          }
        });
      }));
    }
  }));

  return related;
};

const extractRelated = (
  ids: Arrayable<ExtractedId> | null,
  related: IdentifiersMap<string, ModelIdType, ModelInstance>,
) => {
  if (Array.isArray(ids)) {
    return ids
      .map(({ type, id }) => related.find(type ?? '', id))
      .filter((value) => value !== undefined);
  }

  if (!isNil(ids)) {
    return related.find(ids.type ?? '', ids.id);
  }

  return null;
};

const remapRelated = <I extends ModelInstance>(
  ids: Map<I, Map<ModelRelationKey<I>, Arrayable<ExtractedId> | null>>,
  related: IdentifiersMap<string, ModelIdType, ModelInstance>,
) => ids.forEach((idsForInstance, instance) => {
  idsForInstance.forEach((extractIds, relation) => {
    const value = extractRelated(extractIds, related);
    if (value === undefined) {
      return;
    }

    loadUsingValue(instance, relation, value as any);
  });
});

/**
 * Create a relations loader using related model and IDs included in raw
 * data source's records.
 *
 * @param action
 * @param options
 *
 * @category Factories
 * @since 0.8.2
 *
 * @example
 * ```typescript
 * import { makeQueryModelLoader } from '@foscia/core';
 * import { param } from '@foscia/http';
 *
 * export default makeQueryModelLoader(action, {
 *   prepare: (a, { ids }) => a.use(param({ ids })),
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
  options: QueryModelLoaderOptions<RawData, Data, Deserialized, C> = {},
) => async <I extends ModelInstance>(
  instances: Arrayable<I>,
  ...relations: ArrayableVariadic<ModelRelationDotKey<I>>
) => loadUsingCallback(instances, relations, async (allInstances, allRelations) => {
  // First, we will extract all IDs for targeted model for each root relations.
  // This will allow us to remap values on each relation.
  const groupedRelations = groupRelationsByRoots(allRelations);
  const extractedIds = extractIdsMap(options, allInstances, groupedRelations);

  const groupedRelationsModels = await groupRelationsByModels(
    allInstances[0].$model as Model,
    groupedRelations,
    await action().useContext(),
  );

  // When there are extracted IDs for instances' relations, we will query
  // each related model to retrieve all related instances.
  const fetchedRelated = await fetchRelatedMap(
    action,
    options,
    groupedRelationsModels as Map<Model, { relations: ModelRelationKey<I>[]; nested: string[] }>,
    extractedIds,
  );

  // Once related instances are retrieved, we will define relation values
  // based on extracted IDs format.
  remapRelated(extractedIds, fetchedRelated);
});
