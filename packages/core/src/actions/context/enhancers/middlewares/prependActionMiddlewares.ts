import replaceActionMiddlewares
  from '@foscia/core/actions/context/enhancers/middlewares/replaceActionMiddlewares';
import { ActionMiddleware } from '@foscia/core/actions/types';
import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import { Arrayable, wrap } from '@foscia/shared';

/**
 * Prepend one or many middlewares.
 *
 * @param middlewares
 *
 * @category Enhancers
 * @since 0.13.0
 *
 * @example
 * ```typescript
 * import { prependActionMiddlewares } from '@foscia/core';
 *
 * const posts = await action(prependActionMiddlewares(
 *   (action, next) => {
 *     // Do something...
 *
 *     return next();
 *   },
 * ));
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('prependActionMiddlewares', (<C extends {}, R>(
  middlewares: Arrayable<ActionMiddleware<C, R>>,
) => replaceActionMiddlewares<C, R>((prev) => [...wrap(middlewares), ...prev])));
