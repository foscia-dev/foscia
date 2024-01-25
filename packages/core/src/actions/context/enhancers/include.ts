import context from '@foscia/core/actions/context/enhancers/context';
import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import {
  Action,
  ActionParsedExtension,
  ConsumeInclude,
  InferConsumedModelOrInstance,
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
export default function include<C extends {}>(
  ...relations: ArrayableVariadic<ModelRelationDotKey<InferConsumedModelOrInstance<C>>>
) {
  return async (
    action: Action<C & ConsumeInclude>,
  ) => action.use(context({
    include: uniqueValues([
      ...((await action.useContext()).include ?? []),
      ...wrapVariadic(...relations),
    ]),
  }));
}

type EnhancerExtension = ActionParsedExtension<{
  include<C extends {}, E extends {}>(
    this: Action<C, E>,
    ...relations: ArrayableVariadic<ModelRelationDotKey<InferConsumedModelOrInstance<C>>>
  ): Action<C, E>;
}>;

include.extension = makeEnhancersExtension({ include }) as EnhancerExtension;
