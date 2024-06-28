import context from '@foscia/core/actions/context/enhancers/context';
import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import {
  Action,
  ConsumeInclude,
  InferConsumedModelOrInstance,
  WithParsedExtension,
} from '@foscia/core/actions/types';
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
 */
const include = <C extends {}>(
  ...relations: ArrayableVariadic<ModelRelationDotKey<InferConsumedModelOrInstance<C>>>
) => async (
  action: Action<C & ConsumeInclude>,
) => action.use(context({
  include: uniqueValues([
    ...((await action.useContext()).include ?? []),
    ...wrapVariadic(...relations),
  ]),
}));

export default /* @__PURE__ */ appendExtension(
  'include',
  include,
  'use',
) as WithParsedExtension<typeof include, {
  include<C extends {}, E extends {}>(
    this: Action<C, E>,
    ...relations: ArrayableVariadic<ModelRelationDotKey<InferConsumedModelOrInstance<C>>>
  ): Action<C, E>;
}>;
