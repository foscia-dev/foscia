import {
  Action,
  FosciaError,
  InferQueryModelOrInstance,
  makeEnhancer,
  ModelKey,
  resolveContextModels,
} from '@foscia/core';
import fieldsFor from '@foscia/jsonapi/actions/context/enhancers/fieldsFor';
import { Arrayable } from '@foscia/shared';

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
  fieldset: Arrayable<ModelKey<InferQueryModelOrInstance<C>>>,
) => async (action: Action<C>) => {
  const models = await resolveContextModels(action);
  if (models.length === 1) {
    return action(fieldsFor(models[0], fieldset));
  }

  throw new FosciaError(
    'Could not detect context\'s model when applying fieldsets.',
  );
});
