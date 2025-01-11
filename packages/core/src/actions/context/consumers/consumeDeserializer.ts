import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeDeserializer } from '@foscia/core/actions/types';
import { DeserializedData } from '@foscia/core/types';
import { value } from '@foscia/shared';

/**
 * Retrieve the deserializer from a context.
 *
 * @param context
 * @param defaultValue
 */
export default <
  C extends {},
  Data,
  Deserialized extends DeserializedData = DeserializedData,
  D = never,
>(
  context: C & Partial<ConsumeDeserializer<Data, Deserialized>>,
  defaultValue?: D,
) => value(consumeContext(context, 'deserializer', ['context'], defaultValue));
