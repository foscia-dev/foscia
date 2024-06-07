import {
  all,
  consumeRegistry,
  guessContextModel,
  include,
  query,
  when,
} from '@foscia/core/actions';
import {
  Action,
  ActionFactory,
  ConsumeAdapter,
  ConsumeDeserializer,
  ConsumeModel,
} from '@foscia/core/actions/types';
import FosciaError from '@foscia/core/errors/fosciaError';
import logger from '@foscia/core/logger/logger';
import groupRelations from '@foscia/core/model/relations/groupRelations';
import loadUsingCallback from '@foscia/core/model/relations/loadUsingCallback';
import loadUsingValue from '@foscia/core/model/relations/loadUsingValue';
import shouldExcludeInstanceAndRelation
  from '@foscia/core/model/relations/shouldExcludeInstanceAndRelation';
import {
  Model,
  ModelIdType,
  ModelInstance,
  ModelRelation,
  ModelRelationDotKey,
  ModelRelationKey,
} from '@foscia/core/model/types';
import normalizeKey from '@foscia/core/normalization/normalizeKey';
import { DeserializedData } from '@foscia/core/types';
import { Arrayable, ArrayableVariadic, Awaitable, isNil, uniqueValues } from '@foscia/shared';

type QueryModelLoaderOptions<
  RawData,
  Data,
  Deserialized extends DeserializedData,
  C extends ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>,
> = {
  extract?: <I extends ModelInstance>(
    instance: I,
    relation: ModelRelationKey<I>,
  ) => Arrayable<ModelIdType> | null | undefined;
  prepare?: (
    action: Action<C & ConsumeModel>,
    context: { ids: ModelIdType[]; relations: string[] },
  ) => Awaitable<unknown>;
  chunk?: (instances: ModelIdType[]) => ModelIdType[][];
  exclude?: <I extends ModelInstance>(instance: I, relation: ModelRelationDotKey<I>) => boolean;
};

export default function makeQueryModelLoader<
  RawData,
  Data,
  Deserialized extends DeserializedData,
  C extends ConsumeAdapter<RawData, Data> & ConsumeDeserializer<NonNullable<Data>, Deserialized>,
>(
  action: ActionFactory<[], C, {}>,
  options: QueryModelLoaderOptions<RawData, Data, Deserialized, C> = {},
) {
  return async <I extends ModelInstance>(
    instances: Arrayable<I>,
    ...relations: ArrayableVariadic<ModelRelationDotKey<I>>
  ) => loadUsingCallback(instances, relations, async (allInstances, allRelations) => {
    const groupedRelations = groupRelations(allRelations);

    await Promise.all(groupedRelations.map(async ([rootRelation, subRelations]) => {
      const rootModel = allInstances[0].$model;
      const relatedModel = await guessContextModel({
        model: allInstances[0].$model as Model,
        relation: rootModel.$schema[rootRelation] as ModelRelation,
        registry: await consumeRegistry(await action().useContext() as {}, null),
      });
      if (!relatedModel) {
        throw new FosciaError(`
No alternative found to resolve model of relation \`${rootModel.$type}.${rootRelation}\`.
You should either:
  - Define explicit related model/type on your relations.
  - Define a registry to hold types to models mapping.
`.trim());
      }

      const extractedIdsMap = new Map<I, Arrayable<ModelIdType> | null>();
      allInstances.forEach((instance) => {
        if (
          options.exclude
          && shouldExcludeInstanceAndRelation(instance, rootRelation, subRelations, options.exclude)
        ) {
          return;
        }

        const extractedIds = (
          options.extract ?? ((i, r) => i.$raw[normalizeKey(i.$model, r)])
        )(instance, rootRelation);
        if (extractedIds === undefined) {
          logger.warn(
            `Extracted \`${rootRelation}\` relation's IDs for \`${instance.$model.$type}:${instance.id}\` is undefined, you should customize extraction process using \`extract\` option.`,
          );

          return;
        }

        extractedIdsMap.set(instance, extractedIds);
      });

      const related = new Map<ModelIdType, ModelInstance>();
      const extractedIds = uniqueValues(
        [...extractedIdsMap.values()].flat().filter((id) => !isNil(id)),
      ) as ModelIdType[];
      if (extractedIds.length) {
        const chunk = (
          options.chunk ?? ((i) => [i])
        ) as (instances: ModelIdType[]) => ModelIdType[][];

        await Promise.all(chunk(extractedIds).map(async (chunkIds) => {
          const chunkRelated = await action()
            .use(query(relatedModel), include(subRelations as any))
            .use(when(() => options.prepare, async (a, p) => {
              await p(a as Action<C & ConsumeModel>, { ids: chunkIds, relations: subRelations });
            }))
            .run(all());

          chunkRelated.forEach(
            (relatedInstance) => related.set(relatedInstance.id, relatedInstance),
          );
        }));
      }

      const extractRelated = (id: ModelIdType) => {
        const value = related.get(id);
        if (!value) {
          logger.warn(
            `Loading relations for \`${rootModel.$type}:${rootRelation}\` did not work, instance with ID \`${id}\` was not found in fetched list.`,
          );
        }

        return value;
      };

      [...extractedIdsMap.entries()].forEach(([instance, ids]) => {
        let relatedValue = null as Arrayable<ModelInstance> | null;
        if (Array.isArray(ids)) {
          relatedValue = ids.reduce((values, id) => {
            const value = extractRelated(id);
            if (value) {
              values.push(value);
            }

            return values;
          }, [] as ModelInstance[]);
        } else if (!isNil(ids)) {
          const value = extractRelated(ids);
          if (value === undefined) {
            return;
          }

          relatedValue = value;
        }

        loadUsingValue(instance, rootRelation, relatedValue as any);
      });
    }));
  });
}
