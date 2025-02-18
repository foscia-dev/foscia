import context from '@foscia/core/actions/context/enhancers/context';
import serializeInstance from '@foscia/core/actions/context/utilities/serializeInstance';
import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import { Action, ConsumeSerializer } from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';

/**
 * Serialize the given instance as the context's data.
 *
 * @param instance
 *
 * @category Enhancers
 * @requireContext serializer
 */
export default /* @__PURE__ */ makeEnhancer('instanceData', <C extends {}, Record, Related, Data>(
  instance: ModelInstance,
) => async (
  action: Action<C & ConsumeSerializer<Record, Related, Data>>,
) => action(context({
  data: await serializeInstance(await action.useContext(), instance),
})));
