import consumeDeserializer from '@foscia/core/actions/context/consumers/consumeDeserializer';
import { Action, ConsumeDeserializer } from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { isNil } from '@foscia/shared';

export type DeserializedDataOf<I extends ModelInstance, DD extends DeserializedData> = {
  instances: I[];
} & Omit<DD, 'instances'>;

export default async function deserializeInstances<
  C extends {}, Data, Deserialized extends DeserializedData = DeserializedData,
>(action: Action<C & ConsumeDeserializer<NonNullable<Data>, Deserialized>>, data: Data) {
  if (isNil(data)) {
    return { instances: [] };
  }

  const context = await action.useContext();
  const deserializer = await consumeDeserializer(context);

  return deserializer.deserialize(data!, context);
}
