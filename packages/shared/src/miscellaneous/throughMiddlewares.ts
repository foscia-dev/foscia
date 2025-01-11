import { Middleware, MiddlewareNext } from '@foscia/shared/types';

/**
 * Execute a callback through a set of middlewares.
 *
 * @param middlewares
 * @param callback
 *
 * @internal
 */
export default <V, R>(
  middlewares: Middleware<V, R>[],
  callback: MiddlewareNext<V, R>,
) => middlewares.reduceRight<MiddlewareNext<V, R>>(
  (next, middleware) => (value) => middleware(value, next),
  callback,
);
