import {
  Action,
  FosciaError,
  guessContextModel,
  InferQueryModelOrInstance,
  makeEnhancer,
  ModelKey,
} from '@foscia/core';
import fieldsFor from '@foscia/jsonapi/actions/context/enhancers/fieldsFor';
import { ArrayableVariadic } from '@foscia/shared';

/**
 * [Select the given JSON:API fieldsets](https://jsonapi.org/format/#fetching-sparse-fieldsets)
 * for the current context's model.
 * The new fieldsets will be merged with the previous ones.
 * This is a shortcut of {@link fieldsFor | `fieldsFor`} using the context model.
 *
 * @param fieldset
 *
 * @category Enhancers
 *
 * @example
 * ```typescript
 * import { query, all } from '@foscia/core';
 * import { fields } from '@foscia/jsonapi';
 *
 * const posts = await action(
 *   query(Post),
 *   fields(['title', 'body']),
 *   all(),
 * );
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('fields', <C extends {}>(
  ...fieldset: ArrayableVariadic<ModelKey<InferQueryModelOrInstance<C>>>
) => async (action: Action<C>) => {
  const model = await guessContextModel(await action.useContext());
  if (model) {
    return action(fieldsFor(model, ...fieldset));
  }

  throw new FosciaError(
    'Could not detect context\'s model when applying fieldsets.',
  );
});
