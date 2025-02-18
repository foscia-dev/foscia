import consumeActionMiddlewares
  from '@foscia/core/actions/context/consumers/consumeActionMiddlewares';
import context from '@foscia/core/actions/context/enhancers/context';
import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import { Action, ActionMiddleware } from '@foscia/core/actions/types';
import { Awaitable } from '@foscia/shared';

/**
 * Replace existing middlewares with the given middlewares array factory.
 *
 * @param middlewares
 *
 * @category Enhancers
 * @since 0.13.0
 *
 * @example
 * ```typescript
 * import { replaceActionMiddlewares } from '@foscia/core';
 *
 * const posts = await action(replaceActionMiddlewares((previous) => [
 *   ...previous,
 *   (action, next) => {
 *     // Do something...
 *
 *     return next();
 *   },
 * ]));
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('replaceActionMiddlewares', (<C extends {}, R>(
  middlewares: (prev: ActionMiddleware<C, R>[]) => Awaitable<ActionMiddleware<C, R>[]>,
) => async (action: Action<C>) => action(context({
  middlewares: await middlewares(
    consumeActionMiddlewares(await action.useContext(), []) as ActionMiddleware<C, R>[],
  ),
}))));
