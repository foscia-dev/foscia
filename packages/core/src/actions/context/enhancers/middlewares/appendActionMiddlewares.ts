import replaceActionMiddlewares
  from '@foscia/core/actions/context/enhancers/middlewares/replaceActionMiddlewares';
import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import { ActionMiddleware } from '@foscia/core/actions/types';
import { ArrayableVariadic, wrapVariadic } from '@foscia/shared';

/**
 * Append one or many middlewares.
 *
 * @param middlewares
 *
 * @category Enhancers
 * @since 0.13.0
 *
 * @example
 * ```typescript
 * import { appendActionMiddlewares } from '@foscia/core';
 *
 * const posts = await action(appendActionMiddlewares(
 *   (action, next) => {
 *     // Do something...
 *
 *     return next();
 *   },
 * ));
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('appendActionMiddlewares', (<C extends {}, R>(
  ...middlewares: ArrayableVariadic<ActionMiddleware<C, R>>
) => replaceActionMiddlewares<C, R>((prev) => [...prev, ...wrapVariadic(...middlewares)])));
