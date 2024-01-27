import consumeSerializer from '@foscia/core/actions/context/consumers/consumeSerializer';
import { Action, ConsumeSerializer } from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';

export default async function serializeInstance<C extends {}, Record, Related, Data>(
  action: Action<C & ConsumeSerializer<Record, Related, Data>>,
  instance: ModelInstance,
) {
  const context = await action.useContext();
  const serializer = await consumeSerializer(context);

  return serializer.serialize(await serializer.serializeInstance(instance, context), context);
}
