import { Action, context, makeEnhancer } from '@foscia/core';
import consumeRequestConfig from '@foscia/http/actions/context/consumers/consumeRequestConfig';
import { HttpRequestConfig } from '@foscia/http/types';

/**
 * Configure an HTTP request used by the HTTP adapter.
 *
 * Some configuration options will be merged when possible (object query params,
 * headers, middlewares, etc.).
 * This enhancer can be used to configure a full request object or preconfigure
 * some common options (e.g. headers and middlewares).
 * Passing a {@link !Request | fetch `Request` object}
 * as `request` option will ignore any other configuration and request
 * object will be directly passed to the adapter. Middlewares will still be
 * applied, but other automatic transformation or data passing (params, body, etc.)
 * won't be applied.
 *
 * @param nextConfig
 *
 * @category Enhancers
 *
 * @example
 * `configureRequest` can be used as any other request enhancers (such as
 * {@link makeGet | `makeGet`}).
 *
 * ```typescript
 * import { raw } from '@foscia/core';
 * import { configureRequest } from '@foscia/http';
 *
 * const response = await action(configureRequest({
 *   method: 'GET',
 *   baseURL: 'https://example.com/api,
 *   path: 'posts',
 *   params: { search: 'foo' },
 * }), raw());
 * ```
 *
 * `configureRequest` can also be used to preconfigure every future requests,
 * directly in your action factory.
 *
 * ```typescript
 * import { makeActionFactory } from '@foscia/core';
 * import { configureRequest } from '@foscia/http';
 *
 * export default makeActionFactory({
 *   // ...
 *   configureRequest({ headers: { Authorization: 'Bearer super-secret' } }),
 * });
 * ```
 *
 * Finally, to match complex use case, `configureRequest` can also receive a
 * {@link !Request | `Request`} object.
 *
 * ```typescript
 * import { makeActionFactory } from '@foscia/core';
 * import { configureRequest } from '@foscia/http';
 *
 * const response = await action(configureRequest({
 *   request: new Request('https://example.com/special/request', {}),
 * }), raw());
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('configureRequest', (
  nextConfig: HttpRequestConfig,
) => async <C extends {}>(action: Action<C>) => {
  const prevRequestConfig = await consumeRequestConfig(action, {} as HttpRequestConfig);

  return action(context({
    httpRequestConfig: {
      ...prevRequestConfig,
      ...nextConfig,
      headers: { ...prevRequestConfig.headers, ...nextConfig?.headers },
      params: typeof nextConfig.params === 'string' ? nextConfig.params : {
        ...(typeof prevRequestConfig.params === 'string' ? {} : prevRequestConfig.params),
        ...nextConfig.params,
      },
    } as HttpRequestConfig,
  }));
});
