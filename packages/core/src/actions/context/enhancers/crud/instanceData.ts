import context from '@foscia/core/actions/context/enhancers/context';
import serializeInstance from '@foscia/core/actions/context/utils/serializeInstance';
import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import { Action, ActionParsedExtension, ConsumeSerializer } from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';

/**
 * Serialize the given instance as the context's data.
 *
 * @param instance
 *
 * @category Enhancers
 */
export default function instanceData<C extends {}, Record, Related, Data>(instance: ModelInstance) {
  return async (
    action: Action<C & ConsumeSerializer<Record, Related, Data>>,
  ) => action.use(context({
    data: await serializeInstance(action, instance),
  }));
}

type EnhancerExtension = ActionParsedExtension<{
  instanceData<C extends {}, E extends {}, Record, Related, Data>(
    this: Action<C & ConsumeSerializer<Record, Related, Data>, E>,
    instance: ModelInstance,
  ): Action<C, E>;
}>;

instanceData.extension = makeEnhancersExtension({ instanceData }) as EnhancerExtension;
