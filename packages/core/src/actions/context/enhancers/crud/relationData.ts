import context from '@foscia/core/actions/context/enhancers/context';
import serializeRelation from '@foscia/core/actions/context/utilities/serializeRelation';
import { Action, ConsumeSerializer } from '@foscia/core/actions/types';
import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import { ModelInstance, ModelRelationKey } from '@foscia/core/model/types';

/**
 * Serialize the given instance's relation as the context's data.
 *
 * @param instance
 * @param key
 *
 * @category Enhancers
 * @requireContext serializer
 */
export default /* @__PURE__ */ makeEnhancer('relationData', <
  C extends {},
  I extends ModelInstance,
  Record,
  Related,
  Data,
>(
  instance: I,
  key: ModelRelationKey<I>,
) => async (
  action: Action<C & ConsumeSerializer<Record, Related, Data>>,
) => action(context({
  data: await serializeRelation(
    action,
    instance,
    key,
    instance[key],
  ),
})));
