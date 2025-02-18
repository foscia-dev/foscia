import consumeContext from '@foscia/core/actions/context/consumers/consumeContext';
import { ActionMiddleware, ConsumeActionMiddlewares } from '@foscia/core/actions/types';

/**
 * Retrieve the action's middlewares from a context.
 *
 * @param context
 * @param defaultValue
 *
 * @internal
 */
export default <C extends {}, R, D = never>(
  context: C & Partial<ConsumeActionMiddlewares<C, R>>,
  defaultValue?: D,
) => consumeContext(context, 'middlewares', [
  'appendActionMiddlewares',
  'prependActionMiddlewares',
  'replaceActionMiddlewares',
], defaultValue) as ActionMiddleware<C, R>[] | D;
