import context from '@foscia/core/actions/context/enhancers/context';
import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import { Action, ActionParsedExtension, ConsumeId } from '@foscia/core/actions/types';
import { ModelIdType } from '@foscia/core/model/types';

/**
 * Target the given ID.
 *
 * @param id
 *
 * @category Enhancers
 */
export default function forId(id: ModelIdType | undefined) {
  return context({ id });
}

type EnhancerExtension = ActionParsedExtension<{
  forId<C extends {}, E extends {}, Id extends ModelIdType | undefined>(
    this: Action<C, E>,
    id: Id,
  ): Action<C & ConsumeId, E>;
}>;

forId.extension = makeEnhancersExtension({ forId }) as EnhancerExtension;
