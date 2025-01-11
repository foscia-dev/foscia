import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeId } from '@foscia/core/actions/types';

/**
 * Retrieve the record ID from a context.
 *
 * @param context
 * @param defaultValue
 */
export default <C extends {}, D = never>(
  context: C & Partial<ConsumeId>,
  defaultValue?: D,
) => consumeContext(context, 'id', [
  'query',
  'update',
  'destroy',
], defaultValue);
