import context from '@foscia/core/actions/context/enhancers/context';
import serializeRelation from '@foscia/core/actions/context/utils/serializeRelation';
import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import { Action, ConsumeSerializer, WithParsedExtension } from '@foscia/core/actions/types';
import { ModelInstance, ModelRelationKey } from '@foscia/core/model/types';

/**
 * Serialize the given instance's relation as the context's data.
 *
 * @param instance
 * @param key
 *
 * @category Enhancers
 */
const relationData = <C extends {}, I extends ModelInstance, Record, Related, Data>(
  instance: I,
  key: ModelRelationKey<I>,
) => async (
  action: Action<C & ConsumeSerializer<Record, Related, Data>>,
) => action.use(context({
  data: await serializeRelation(action, instance, key, instance[key]),
}));

export default /* @__PURE__ */ appendExtension(
  'relationData',
  relationData,
  'use',
) as WithParsedExtension<typeof relationData, {
  relationData<C extends {}, E extends {}, I extends ModelInstance, Record, Related, Data>(
    this: Action<C & ConsumeSerializer<Record, Related, Data>, E>,
    instance: I,
    key: ModelRelationKey<I>,
  ): Action<C, E>;
}>;
