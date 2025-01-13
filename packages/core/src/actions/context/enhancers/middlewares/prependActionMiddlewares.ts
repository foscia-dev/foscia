import replaceActionMiddlewares
  from '@foscia/core/actions/context/enhancers/middlewares/replaceActionMiddlewares';
import makeEnhancer from '@foscia/core/actions/makeEnhancer';
import { ActionMiddleware } from '@foscia/core/actions/types';
import { ArrayableVariadic, wrapVariadic } from '@foscia/shared';

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
 * const posts = await action().use(prependActionMiddlewares(
 *   (action, next) => {
 *     // Do something...
 *
 *     return next();
 *   },
 * ));
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('prependActionMiddlewares', (<C extends {}, R>(
  ...middlewares: ArrayableVariadic<ActionMiddleware<C, R>>
) => replaceActionMiddlewares<C, R>((prev) => [...wrapVariadic(...middlewares), ...prev])));
