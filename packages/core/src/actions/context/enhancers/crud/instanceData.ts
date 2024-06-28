import context from '@foscia/core/actions/context/enhancers/context';
import serializeInstance from '@foscia/core/actions/context/utils/serializeInstance';
import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import { Action, ConsumeSerializer, WithParsedExtension } from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';

/**
 * Serialize the given instance as the context's data.
 *
 * @param instance
 *
 * @category Enhancers
 */
const instanceData = <C extends {}, Record, Related, Data>(
  instance: ModelInstance,
) => async (
  action: Action<C & ConsumeSerializer<Record, Related, Data>>,
) => action.use(context({
  data: await serializeInstance(action, instance),
}));

export default /* @__PURE__ */ appendExtension(
  'instanceData',
  instanceData,
  'use',
) as WithParsedExtension<typeof instanceData, {
  instanceData<C extends {}, E extends {}, Record, Related, Data>(
    this: Action<C & ConsumeSerializer<Record, Related, Data>, E>,
    instance: ModelInstance,
  ): Action<C, E>;
}>;
