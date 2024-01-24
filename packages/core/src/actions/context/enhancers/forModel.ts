import context from '@foscia/core/actions/context/enhancers/context';
import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import { Action, ActionParsedExtension, ConsumeModel } from '@foscia/core/actions/types';
import { Model } from '@foscia/core/model/types';

/**
 * Target the given model.
 * Use its type and other applicable model's context.
 *
 * @param model
 *
 * @category Enhancers
 */
export default function forModel<
  M extends Model,
>(model: M) {
  return context({ model });
}

type EnhancerExtension = ActionParsedExtension<{
  forModel<C extends {}, E extends {}, M extends Model>(
    this: Action<C, E>,
    model: M,
  ): Action<C & ConsumeModel<M>, E>;
}>;

forModel.extension = makeEnhancersExtension({ forModel }) as EnhancerExtension;
