import { makeEnhancer } from '@foscia/core';
import makeRequest from '@foscia/http/actions/context/enhancers/makeRequest';
import { HttpRequestConfig } from '@foscia/http/types';

/**
 * HTTP POST method shortcut for the {@link makeRequest | `makeRequest`} function.
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
 * import { makePost } from '@foscia/http';
 *
 * const response = await action().run(
 *   makePost('posts', { title: 'Hello World' }),
 *   raw(),
 * );
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('makePost', (
  pathOrBaseURL: string,
  body?: HttpRequestConfig['body'],
  config?: Omit<HttpRequestConfig, 'method' | 'body'>,
) => makeRequest(pathOrBaseURL, {
  method: 'POST',
  body,
  ...config,
}));
