import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeDeserializer } from '@foscia/core/actions/types';
import { DeserializedData } from '@foscia/core/types';
import { value } from '@foscia/shared';

export default function consumeDeserializer<
  C extends {},
  Data,
  Deserialized extends DeserializedData = DeserializedData,
  D = never,
>(
  context: C & Partial<ConsumeDeserializer<Data, Deserialized>>,
  defaultValue?: D,
) {
  return value(consumeContext(context, 'deserializer', ['context'], defaultValue));
}
