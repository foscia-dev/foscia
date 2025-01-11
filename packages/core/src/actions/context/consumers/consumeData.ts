import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeData } from '@foscia/core/actions/types';

/**
 * Retrieve the data from a context.
 *
 * @param context
 * @param defaultValue
 */
export default <C extends {}, D = never>(
  context: C & Partial<ConsumeData>,
  defaultValue?: D,
) => consumeContext(context, 'data', ['context'], defaultValue);
