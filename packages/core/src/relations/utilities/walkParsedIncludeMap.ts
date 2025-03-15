import { ModelRelation } from '@foscia/core/model/types';
import { ParsedInclude, ParsedIncludeMap } from '@foscia/core/relations/types';
import { Awaitable } from '@foscia/shared';

/**
 * Deeply walk a {@link ParsedIncludeMap | `ParsedIncludeMap`}.
 *
 * @param includeMap
 * @param callback
 * @param ancestors
 *
 * @category Utilities
 * @internal
 */
const walkParsedIncludeMap = (
  includeMap: ParsedIncludeMap,
  callback: (
    relation: ModelRelation,
    include: ParsedInclude,
    ancestors: [ModelRelation, ParsedInclude][],
  ) => Awaitable<void>,
  ancestors: [ModelRelation, ParsedInclude][] = [],
) => Promise.all(Array.from(includeMap, async ([relation, include]) => {
  await callback(relation, include, ancestors);
  await walkParsedIncludeMap(
    include.include,
    callback,
    [...ancestors, [relation, include]],
  );
}));

export default walkParsedIncludeMap;
