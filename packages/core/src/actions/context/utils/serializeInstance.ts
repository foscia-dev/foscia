import consumeSerializer from '@foscia/core/actions/context/consumers/consumeSerializer';
import { Action, ConsumeSerializer } from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';

export default async function serializeInstance<C extends {}, SD>(
  action: Action<C & ConsumeSerializer<SD>>,
  instance: ModelInstance,
) {
  const context = await action.useContext();

  return consumeSerializer(context).serialize(instance, context);
}
