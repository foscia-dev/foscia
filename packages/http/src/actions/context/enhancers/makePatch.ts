import { makeEnhancer } from '@foscia/core';
import makeRequest from '@foscia/http/actions/context/enhancers/makeRequest';
import { HttpRequestConfig } from '@foscia/http/types';

/**
 * HTTP PATCH method shortcut for the {@link makeRequest | `makeRequest`} function.
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
 * import { makePatch } from '@foscia/http';
 *
 * const response = await action(
 *   makePatch('posts/1', { title: 'Hello World V2' }),
 *   raw(),
 * );
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('makePatch', (
  pathOrBaseURL: string,
  body?: HttpRequestConfig['body'],
  config?: Omit<HttpRequestConfig, 'method' | 'body'>,
) => makeRequest(pathOrBaseURL, {
  method: 'PATCH',
  body,
  ...config,
}));
