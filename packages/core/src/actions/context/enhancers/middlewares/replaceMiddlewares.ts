import consumeMiddlewares from '@foscia/core/actions/context/consumers/consumeMiddlewares';
import context from '@foscia/core/actions/context/enhancers/context';
import makeEnhancer from '@foscia/core/actions/makeEnhancer';
import { Action, ActionMiddleware } from '@foscia/core/actions/types';
import { Awaitable } from '@foscia/shared';

/**
 * Replace existing middlewares with the given middlewares array factory.
 *
 * @param factory
 *
 * @category Enhancers
 * @since 0.13.0
 *
 * @example
 * ```typescript
 * import { replaceMiddlewares } from '@foscia/core';
 *
 * const posts = await action().use(replaceMiddlewares((previous) => [
 *   ...previous,
 *   (action, next) => {
 *     // Do something...
 *
 *     return next();
 *   },
 * ]));
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('replaceMiddlewares', (<C extends {}, R>(
  middlewares: ((prev: ActionMiddleware<C, R>[]) => Awaitable<ActionMiddleware<C, R>[]>),
) => async (action: Action<C>) => action.use(context({
  middlewares: await middlewares(
    consumeMiddlewares(await action.useContext(), []) as ActionMiddleware<C, R>[],
  ),
}))));
