import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ActionMiddleware, ConsumeMiddlewares } from '@foscia/core/actions/types';

/**
 * Retrieve the action's middlewares from a context.
 *
 * @param context
 * @param defaultValue
 */
export default <C extends {}, R, D = never>(
  context: C & Partial<ConsumeMiddlewares<C, R>>,
  defaultValue?: D,
) => consumeContext(context, 'middlewares', [
  'appendMiddlewares',
  'prependMiddlewares',
  'replaceMiddlewares',
], defaultValue) as ActionMiddleware<C, R>[] | D;
