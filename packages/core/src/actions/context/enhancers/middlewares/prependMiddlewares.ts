import replaceMiddlewares
  from '@foscia/core/actions/context/enhancers/middlewares/replaceMiddlewares';
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
 * import { prependMiddlewares } from '@foscia/core';
 *
 * const posts = await action().use(prependMiddlewares(
 *   (action, next) => {
 *     // Do something...
 *
 *     return next();
 *   },
 * ));
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('prependMiddlewares', (<C extends {}, R>(
  ...middlewares: ArrayableVariadic<ActionMiddleware<C, R>>
) => replaceMiddlewares<C, R>((prev) => [...wrapVariadic(...middlewares), ...prev])));
