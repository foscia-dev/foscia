import consumeRegistry from '@foscia/core/actions/context/consumers/consumeRegistry';
import { Action } from '@foscia/core/actions/types';
import FosciaError from '@foscia/core/errors/fosciaError';
import isRelation from '@foscia/core/model/props/checks/isRelation';
import { Model, ModelRelation } from '@foscia/core/model/types';
import {
  ParsedIncludeMap,
  ParsedIncludeQuery,
  ParsedRawInclude,
} from '@foscia/core/relations/types';
import resolveRelatedModels from '@foscia/core/relations/utilities/resolveRelatedModels';
import toParsedRawInclude from '@foscia/core/relations/utilities/toParsedRawInclude';
import { sequentialTransform, wrap } from '@foscia/shared';

/**
 * Parse {@link ParsedRawInclude | `ParsedRawInclude`} array into a
 * {@link ParsedIncludeMap | `ParsedIncludeMap`}.
 *
 * @param action
 * @param models
 * @param rawIncludes
 *
 * @category Utilities
 * @internal
 */
const parseRawInclude = async (
  action: Action,
  models: Model[],
  rawIncludes: ParsedRawInclude[],
) => {
  // TODO Support relation-less eager loadings?
  // TODO Append relations include and query (if not disabled through RawInclude).
  const registry = await consumeRegistry(action, null);

  const nextInclude: ParsedIncludeMap = new Map();

  const mergeInclude = async (
    include: ParsedIncludeMap,
    relation: ModelRelation,
    customQuery: ParsedIncludeQuery | null,
    relationQuery: ParsedIncludeQuery | null,
    requested: boolean,
  ) => {
    const prevParsedInclude = include.get(relation);
    const relatedModels = prevParsedInclude?.models
      ?? await resolveRelatedModels(relation, registry);

    include.set(relation, {
      requested: requested || !!prevParsedInclude?.requested,
      models: relatedModels,
      include: prevParsedInclude?.include ?? new Map(),
      customQuery: customQuery ?? prevParsedInclude?.customQuery ?? null,
      relationQuery: relationQuery ?? prevParsedInclude?.relationQuery ?? null,
    });
  };

  const mergeIncludes = async (prev: ParsedIncludeMap, next: ParsedIncludeMap) => {
    await Promise.all(Array.from(next, async ([relation, include]) => {
      await mergeInclude(
        prev,
        relation,
        include.customQuery,
        include.relationQuery,
        include.requested,
      );

      if (include.include) {
        await mergeIncludes(prev.get(relation)!.include, include.include);
      }
    }));
  };

  await sequentialTransform(rawIncludes.map((rawInclude) => async () => {
    if (rawInclude instanceof Map) {
      await mergeIncludes(nextInclude, rawInclude);
    } else {
      const assertModelsFound = (through: Model[], key: string) => {
        if (!through.length) {
          throw new FosciaError(
            `Could not include relation \`${key}\`: no related models resolved.`,
          );
        }
      };

      const parseInclude = async (
        include: ParsedIncludeMap,
        through: Model[],
        key: string,
        query: ParsedIncludeQuery | null,
      ) => {
        const [rootKey, ...subKeys] = key.split('.');
        assertModelsFound(models, rootKey);

        const realQuery = subKeys.length ? null : query;

        await Promise.all(through.map(async (model) => {
          const relation = model.$schema[rootKey];
          if (isRelation(relation)) {
            await mergeInclude(
              include,
              relation,
              realQuery,
              (!rawInclude.options.withoutQuery && relation.query) || null,
              !subKeys.length,
            );

            const nextParsedInclude = include.get(relation)!;
            assertModelsFound(nextParsedInclude.models, rootKey);

            if (subKeys.length) {
              await parseInclude(
                nextParsedInclude.include,
                nextParsedInclude.models,
                subKeys.join('.'),
                query,
              );
            }

            if (!rawInclude.options.withoutInclude && relation.include) {
              await mergeIncludes(
                nextParsedInclude.include,
                await parseRawInclude(
                  action,
                  nextParsedInclude.models,
                  [toParsedRawInclude(relation.include, rawInclude.options)],
                ),
              );
            }
          }
        }));
      };

      const entries: (string | [string, ParsedIncludeQuery | null])[] = (
        typeof rawInclude.include !== 'string' ? [
          ...Array.isArray(rawInclude.include)
            ? Array.from(rawInclude.include)
            : Object.entries(rawInclude.include),
        ] : [rawInclude.include]
      );

      await Promise.all(entries.map(async (keyAndQuery) => {
        const [key, query] = wrap(keyAndQuery) as [string, ParsedIncludeQuery | null | undefined];

        await parseInclude(nextInclude, models, key, query ?? null);
      }));
    }
  }));

  return nextInclude;
};

export default parseRawInclude;
