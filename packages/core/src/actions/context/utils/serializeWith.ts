import { Action, ConsumeSerializer } from '@foscia/core/actions/types';
import { SerializerI } from '@foscia/core/types';
import consumeSerializer from '../consumers/consumeSerializer';

export default async function serializeWith<C extends {}, Return, Record, Related, Data>(
  action: Action<C & ConsumeSerializer<Record, Related, Data>>,
  callback: (serializer: SerializerI<Record, Related, Data>, context: C) => Return,
) {
  const context = await action.useContext();

  return callback(await consumeSerializer(context), context);
}
