import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeInclude } from '@foscia/core/actions/types';

/**
 * Retrieve the included relations from a context.
 *
 * @param context
 * @param defaultValue
 */
export default <C extends {}, D = never>(
  context: C & Partial<ConsumeInclude>,
  defaultValue?: D,
) => consumeContext(context, 'include', ['include'], defaultValue);
