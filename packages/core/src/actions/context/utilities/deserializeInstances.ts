import consumeDeserializer from '@foscia/core/actions/context/consumers/consumeDeserializer';
import { ConsumeDeserializer } from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';
import { DeserializedData } from '@foscia/core/types';
import { isNil, using } from '@foscia/shared';

/**
 * Deserialized data with a strongly retyped instances array.
 *
 * @internal
 */
export type RetypedDeserializedData<DD extends DeserializedData, I extends ModelInstance> = {
  instances: I[];
} & Omit<DD, 'instances'>;

/**
 * Deserialize the instances from the given data.
 *
 * @param context
 * @param data
 *
 * @internal
 */
export default async <Data, Deserialized extends DeserializedData = DeserializedData>(
  context: ConsumeDeserializer<NonNullable<Data>, Deserialized>,
  data: Data,
) => (
  isNil(data)
    ? { instances: [] } as unknown as Deserialized
    : using(
      await consumeDeserializer(context),
      (deserializer) => deserializer.deserialize(data!, context),
    )
);
