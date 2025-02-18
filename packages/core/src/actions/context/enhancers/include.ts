import consumeInclude from '@foscia/core/actions/context/consumers/consumeInclude';
import context from '@foscia/core/actions/context/enhancers/context';
import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import { Action, InferQueryModelOrInstance } from '@foscia/core/actions/types';
import { ModelRelationDotKey } from '@foscia/core/model/types';
import { ArrayableVariadic, uniqueValues, wrapVariadic } from '@foscia/shared';

/**
 * Eager load the given relations for the current model definition. It accepts
 * deep relations through dot notation. The new relations will be merged with
 * the previous ones.
 *
 * @param relations
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
  ...relations: ArrayableVariadic<ModelRelationDotKey<InferQueryModelOrInstance<C>>>
) => async (
  action: Action<C>,
) => action(context({
  include: uniqueValues([
    ...(consumeInclude(await action.useContext(), null) ?? []),
    ...wrapVariadic(...relations),
  ]),
})));
