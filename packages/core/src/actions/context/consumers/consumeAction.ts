import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeAction } from '@foscia/core/actions/types';

/**
 * Retrieve the action name from a context.
 *
 * @param context
 * @param defaultValue
 */
export default <C extends {}, D = never>(
  context: C & Partial<ConsumeAction>,
  defaultValue?: D,
) => consumeContext(context, 'action', ['context'], defaultValue);
