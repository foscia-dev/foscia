import {
  Action,
  ActionParsedExtension,
  makeEnhancersExtension,
  Model,
  ModelKey,
  normalizeKey,
} from '@foscia/core';
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
 */
export default function fieldsFor<C extends {}, M extends Model>(
  model: M,
  ...fieldset: ArrayableVariadic<ModelKey<M>>
) {
  return async (action: Action<C>) => {
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
  };
}

type FieldsForEnhancerExtension = ActionParsedExtension<{
  fieldsFor<C extends {}, E extends {}, M extends Model>(
    this: Action<C, E>,
    model: M,
    ...fieldset: ArrayableVariadic<ModelKey<M>>
  ): Action<C, E>;
}>;

fieldsFor.extension = makeEnhancersExtension({ fieldsFor }) as FieldsForEnhancerExtension;
