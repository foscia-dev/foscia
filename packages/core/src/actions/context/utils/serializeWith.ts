import consumeSerializer from '@foscia/core/actions/context/consumers/consumeSerializer';
import { Action, ConsumeSerializer } from '@foscia/core/actions/types';
import { Serializer } from '@foscia/core/types';

export default async <C extends {}, Return, Record, Related, Data>(
  action: Action<C & ConsumeSerializer<Record, Related, Data>>,
  callback: (serializer: Serializer<Record, Related, Data>, context: C) => Return,
) => {
  const context = await action.useContext();

  return callback(await consumeSerializer(context), context);
};
