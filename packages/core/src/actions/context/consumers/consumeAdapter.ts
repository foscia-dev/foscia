import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeAdapter } from '@foscia/core/actions/types';
import { value } from '@foscia/shared';

/**
 * Retrieve the adapter from a context.
 *
 * @param context
 * @param defaultValue
 */
export default <C extends {}, RawData, Data, D = never>(
  context: C & Partial<ConsumeAdapter<RawData, Data>>,
  defaultValue?: D,
) => value(consumeContext(context, 'adapter', ['context'], defaultValue));
