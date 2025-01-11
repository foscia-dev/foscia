import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ConsumeInstance } from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';

/**
 * Retrieve the instance from a context.
 *
 * @param context
 * @param defaultValue
 */
export default <C extends {}, I extends ModelInstance, D = never>(
  context: C & Partial<ConsumeInstance<I>>,
  defaultValue?: D,
) => consumeContext(context, 'instance', [
  'create',
  'update',
  'save',
  'destroy',
], defaultValue) as I | D;
