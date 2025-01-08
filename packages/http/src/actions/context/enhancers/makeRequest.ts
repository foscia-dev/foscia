import { makeEnhancer } from '@foscia/core';
import configureRequest from '@foscia/http/actions/context/enhancers/configureRequest';
import { HttpRequestConfig } from '@foscia/http/types';

const decomposeURL = (pathOrBaseURL: string) => (
  /^(\/|(https?|s?ftp):)/.test(pathOrBaseURL)
    ? { baseURL: pathOrBaseURL }
    : { path: pathOrBaseURL }
);

/**
 * Prepare a generic HTTP request.
 *
 * If given path starts with scheme (`https:`, etc.) or a slash `/`,
 * it will be used as the base URL of action, otherwise it will only be used
 * as path after the configured base URL.
 *
 * @param pathOrBaseURL
 * @param config
 *
 * @category Enhancers
 *
 * @example
 * ```typescript
 * import { raw } from '@foscia/core';
 * import { makeRequest } from '@foscia/http';
 *
 * const response = await action().run(
 *   makeRequest('posts', { params: { search: 'foo' } }),
 *   raw(),
 * );
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('makeRequest', (
  pathOrBaseURL: string,
  config?: HttpRequestConfig,
) => configureRequest({ ...decomposeURL(pathOrBaseURL), ...config }));
