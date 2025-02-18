import context from '@foscia/core/actions/context/enhancers/context';
import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import { Action } from '@foscia/core/actions/types';
import { Model } from '@foscia/core/model/types';
import { ArrayableVariadic, wrapVariadic } from '@foscia/shared';

/**
 * Define models targeted by the query without affecting its execution context.
 *
 * @param models
 *
 * @category Enhancers
 * @since 0.13.0
 * @provideContext queryAs
 *
 * @example
 * ```typescript
 * import { queryAs } from '@foscia/core';
 *
 * action(queryAs(Post));
 * action(queryAs(Post, Comment));
 * action(queryAs([Post, Comment]));
 * ```
 *
 * @remarks
 * This will keep the context state when executing the query, but will take
 * priority when normalizing included relations or deserializing models,
 * allowing to deserialize models from any request (even non-standard ones).
 * The query won't request the model like with `query`, but results will be
 * deserialized as given models (e.g. `all` and `one`) and other functions will
 * use the given models for contextual params (e.g. relations through `include`).
 * When using a registry, `queryAs` can also be called with a type parameter
 * and without the `models` parameters.
 */
export default /* @__PURE__ */ makeEnhancer('queryAs', <C extends {}, M extends Model>(
  ...models: ArrayableVariadic<M>
) => async (
  action: Action<C>,
) => action(context({ queryAs: wrapVariadic(...models) })));
