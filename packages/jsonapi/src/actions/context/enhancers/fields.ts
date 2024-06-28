import {
  Action,
  appendExtension,
  FosciaError,
  guessContextModel,
  InferConsumedModelOrInstance,
  ModelKey,
  WithParsedExtension,
} from '@foscia/core';
import fieldsFor from '@foscia/jsonapi/actions/context/enhancers/fieldsFor';
import { ArrayableVariadic, isNil } from '@foscia/shared';

/**
 * [Select the given JSON:API fieldsets](https://jsonapi.org/format/#fetching-sparse-fieldsets)
 * for the current context's model.
 * The new fieldsets will be merged with the previous ones.
 *
 * @param fieldset
 *
 * @category Enhancers
 */
const fields = <C extends {}>(
  ...fieldset: ArrayableVariadic<ModelKey<InferConsumedModelOrInstance<C>>>
) => async (action: Action<C>) => {
  const context = await action.useContext();
  const model = await guessContextModel(context);

  if (isNil(model)) {
    throw new FosciaError(
      'Could not detect context\'s model when applying fieldsets.',
    );
  }

  return action.use(fieldsFor(model as any, ...fieldset));
};

export default /* @__PURE__ */ appendExtension(
  'fields',
  fields,
  'use',
) as WithParsedExtension<typeof fields, {
  fields<C extends {}, E extends {}>(
    this: Action<C, E>,
    ...fieldset: ArrayableVariadic<ModelKey<InferConsumedModelOrInstance<C>>>
  ): Action<C, E>;
}>;
