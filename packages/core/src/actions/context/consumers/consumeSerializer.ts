import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeSerializer } from '@foscia/core/actions/types';
import { value } from '@foscia/shared';

/**
 * Retrieve the serializer from a context.
 *
 * @param context
 * @param defaultValue
 */
export default <C extends {}, Record, Related, Data, D = never>(
  context: C & Partial<ConsumeSerializer<Record, Related, Data>>,
  defaultValue?: D,
) => value(consumeContext(context, 'serializer', ['context'], defaultValue));
