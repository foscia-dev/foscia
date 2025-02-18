import { makeEnhancer } from '@foscia/core';
import makeRequest from '@foscia/http/actions/context/enhancers/makeRequest';
import { HttpRequestConfig } from '@foscia/http/types';

/**
 * HTTP DELETE method shortcut for the {@link makeRequest | `makeRequest`} function.
 *
 * @param pathOrBaseURL
 * @param body
 * @param config
 *
 * @category Enhancers
 *
 * @example
 * ```typescript
 * import { none } from '@foscia/core';
 * import { makeDelete } from '@foscia/http';
 *
 * const response = await action(makeDelete('posts/1'), none());
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('makeDelete', (
  pathOrBaseURL: string,
  body?: HttpRequestConfig['body'],
  config?: Omit<HttpRequestConfig, 'method' | 'body'>,
) => makeRequest(pathOrBaseURL, {
  method: 'DELETE',
  body,
  ...config,
}));
