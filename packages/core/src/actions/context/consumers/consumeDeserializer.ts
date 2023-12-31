import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeDeserializer } from '@foscia/core/actions/types';
import { DeserializedData } from '@foscia/core/types';
import { value } from '@foscia/shared';

export default function consumeDeserializer<
  C extends {},
  AD,
  DD extends DeserializedData,
  D = never,
>(
  context: C & Partial<ConsumeDeserializer<AD, DD>>,
  defaultValue?: D,
) {
  return value(consumeContext(context, 'deserializer', ['context'], defaultValue));
}
