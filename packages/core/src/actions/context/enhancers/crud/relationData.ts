import context from '@foscia/core/actions/context/enhancers/context';
import serializeRelation from '@foscia/core/actions/context/utils/serializeRelation';
import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import { Action, ActionParsedExtension, ConsumeSerializer } from '@foscia/core/actions/types';
import { ModelInstance, ModelRelationKey } from '@foscia/core/model/types';

/**
 * Serialize the given instance's relation as the context's data.
 *
 * @param instance
 * @param key
 *
 * @category Enhancers
 */
export default function relationData<C extends {}, I extends ModelInstance, Record, Related, Data>(
  instance: I,
  key: ModelRelationKey<I>,
) {
  return async (
    action: Action<C & ConsumeSerializer<Record, Related, Data>>,
  ) => action.use(context({
    data: await serializeRelation(action, instance, key, instance[key]),
  }));
}

type EnhancerExtension = ActionParsedExtension<{
  relationData<C extends {}, E extends {}, I extends ModelInstance, Record, Related, Data>(
    this: Action<C & ConsumeSerializer<Record, Related, Data>, E>,
    instance: I,
    key: ModelRelationKey<I>,
  ): Action<C, E>;
}>;

relationData.extension = makeEnhancersExtension({ relationData }) as EnhancerExtension;
