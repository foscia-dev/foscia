import { makeEnhancer } from '@foscia/core';
import makeRequest from '@foscia/http/actions/context/enhancers/makeRequest';
import { HttpRequestConfig } from '@foscia/http/types';

/**
 * HTTP GET method shortcut for the {@link makeRequest | `makeRequest`} function.
 *
 * @param pathOrBaseURL
 * @param config
 *
 * @category Enhancers
 *
 * @example
 * ```typescript
 * import { raw } from '@foscia/core';
 * import { makeGet } from '@foscia/http';
 *
 * const response = await action().run(
 *   makeGet('posts', { params: { search: 'foo' } }),
 *   raw(),
 * );
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('makeGet', (
  pathOrBaseURL: string,
  config?: Omit<HttpRequestConfig, 'method' | 'body'>,
) => makeRequest(pathOrBaseURL, {
  method: 'GET',
  ...config,
}));
