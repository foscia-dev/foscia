import serializeWith from '@foscia/core/actions/context/utils/serializeWith';
import { Action, ConsumeSerializer } from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';

export default <C extends {}, Record, Related, Data>(
  action: Action<C & ConsumeSerializer<Record, Related, Data>>,
  instance: ModelInstance,
) => serializeWith(action, async (serializer, context) => serializer.serialize(
  await serializer.serializeInstance(instance, context),
  context,
));
