import context from '@foscia/core/actions/context/enhancers/context';
import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import { Action, ConsumeQueryAs, WithParsedExtension } from '@foscia/core/actions/types';
import { Model } from '@foscia/core/model/types';
import { ArrayableVariadic, wrapVariadic } from '@foscia/shared';

/**
 * Define models targeted by the query. This will keep the context state when
 * executing the query, but will take priority when deserializing models,
 * allowing to deserialize models from any request (even non-standard ones).
 * The query won't request the model like with `query`, but results will be
 * deserialized as given models (e.g. `all` and `one`) and other functions will
 * use the given models for contextual params (e.g. relations through `include`).
 * When using a registry, `queryAs` can also be called with a type parameter
 * and without the `models` parameters.
 *
 * @param models
 *
 * @category Enhancers
 */
const queryAs = <M extends Model>(
  ...models: ArrayableVariadic<M>
) => context({ queryAs: wrapVariadic(...models) });

export default /* @__PURE__ */ appendExtension(
  'queryAs',
  queryAs,
  'use',
) as WithParsedExtension<typeof queryAs, {
  queryAs<C extends {}, E extends {}, M extends Model>(
    this: Action<C, E>,
    ...models: ArrayableVariadic<M>
  ): Action<C & ConsumeQueryAs<M>, E>;
}>;
