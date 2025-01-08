import { makeEnhancer } from '@foscia/core';
import makeRequest from '@foscia/http/actions/context/enhancers/makeRequest';
import { HttpRequestConfig } from '@foscia/http/types';

/**
 * HTTP PUT method shortcut for the {@link makeRequest | `makeRequest`} function.
 *
 * @param pathOrBaseURL
 * @param body
 * @param config
 *
 * @category Enhancers
 *
 * @example
 * ```typescript
 * import { raw } from '@foscia/core';
 * import { makePut } from '@foscia/http';
 *
 * const response = await action().run(
 *   makePut('posts/1', { title: 'Hello World V2' }),
 *   raw(),
 * );
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('makePut', (
  pathOrBaseURL: string,
  body?: HttpRequestConfig['body'],
  config?: Omit<HttpRequestConfig, 'method' | 'body'>,
) => makeRequest(pathOrBaseURL, {
  method: 'PUT',
  body,
  ...config,
}));
