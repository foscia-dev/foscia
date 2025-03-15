import consumeEagerLoads from '@foscia/core/actions/context/consumers/consumeEagerLoads';
import context from '@foscia/core/actions/context/enhancers/context';
import { Action, InferQueryModelOrInstance } from '@foscia/core/actions/types';
import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import {
  ParsedIncludeMap,
  ParsedRawInclude,
  RawInclude,
  RawIncludeOptions,
} from '@foscia/core/relations/types';
import toParsedRawInclude from '@foscia/core/relations/utilities/toParsedRawInclude';

/**
 * Eager load the given relations for the current queried models. It accepts
 * deep relations through dot notation. The new relations will be merged with
 * the previous ones.
 *
 * @param relations
 * @param options
 *
 * @category Enhancers
 * @requireContext model
 *
 * @example
 * ```typescript
 * import { query, include } from '@foscia/core';
 *
 * action(query(Post), include('comments'));
 * action(query(Post), include('author', 'comments.author'));
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('include', <C extends {}>(
  relations: RawInclude<InferQueryModelOrInstance<C>>,
  options?: RawIncludeOptions,
) => async (
  action: Action<C>,
) => action(context({
  eagerLoads: [
    ...(await consumeEagerLoads(action, [])),
    toParsedRawInclude(relations, options),
  ] as (ParsedRawInclude | ParsedIncludeMap)[],
})));
