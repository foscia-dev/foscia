import { Action, makeEnhancer, Model, ModelKey, normalizeKey } from '@foscia/core';
import { consumeRequestObjectParams, param } from '@foscia/http';
import { ArrayableVariadic, optionalJoin, uniqueValues, wrapVariadic } from '@foscia/shared';

/**
 * [Select the given JSON:API fieldsets](https://jsonapi.org/format/#fetching-sparse-fieldsets)
 * for the given model. The new fieldsets will be merged with the previous ones.
 *
 * @param model
 * @param fieldset
 *
 * @category Enhancers
 *
 * @example
 * ```typescript
 * import { query, include, all } from '@foscia/core';
 * import { fieldsFor } from '@foscia/jsonapi';
 *
 * const posts = await action().run(
 *   query(Post),
 *   include('comments'),
 *   fields(Comment, ['body', 'author']),
 *   all(),
 * );
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('fieldsFor', <C extends {}, M extends Model>(
  model: M,
  ...fieldset: ArrayableVariadic<ModelKey<M>>
) => async (action: Action<C>) => {
  const context = await action.useContext();
  const prevFields = consumeRequestObjectParams(context)?.fields;
  const nextFields = wrapVariadic(...fieldset).map((key) => normalizeKey(model, key));

  return action.use(param('fields', {
    ...prevFields,
    [model.$type]: optionalJoin(uniqueValues([
      ...((prevFields ?? {})[model.$type] ?? []),
      ...nextFields,
    ]), ','),
  }));
});
