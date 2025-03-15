import { Action, aliasPropKey, makeEnhancer, Model, ModelKey } from '@foscia/core';
import { consumeRequestObjectParams, param } from '@foscia/http';
import { Arrayable, optionalJoin, uniqueValues, wrap } from '@foscia/shared';

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
 * const posts = await action(
 *   query(Post),
 *   include('comments'),
 *   fields(Comment, ['body', 'author']),
 *   all(),
 * );
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('fieldsFor', <C extends {}, M extends Model>(
  model: M,
  fieldset: Arrayable<ModelKey<M>>,
) => async (action: Action<C>) => {
  const prevFields = (await consumeRequestObjectParams(action))?.fields;
  const nextFields = wrap(fieldset).map((key) => aliasPropKey(model.$schema[key]));

  return action(param('fields', {
    ...prevFields,
    [model.$type]: optionalJoin(uniqueValues([
      ...((prevFields ?? {})[model.$type]?.split(',') ?? []),
      ...nextFields,
    ]), ','),
  }));
});
