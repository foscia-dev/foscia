import { Action, appendExtension, WithParsedExtension } from '@foscia/core';
import configureRequest from '@foscia/http/actions/context/enhancers/configureRequest';
import { HttpRequestConfig } from '@foscia/http/types';

const decomposeURL = (pathOrBaseURL: string) => (
  /^(\/|(https?|s?ftp):)/.test(pathOrBaseURL)
    ? { baseURL: pathOrBaseURL }
    : { path: pathOrBaseURL }
);

/**
 * Prepare a generic HTTP request.
 * If given path starts with scheme (HTTPS, etc.), it will be used as the base
 * URL of action, otherwise it will only be used as path.
 *
 * @param pathOrBaseURL
 * @param config
 *
 * @category Enhancers
 */
const makeRequest = (
  pathOrBaseURL: string,
  config?: HttpRequestConfig,
) => configureRequest({ ...decomposeURL(pathOrBaseURL), ...config });

export default /* @__PURE__ */ appendExtension(
  'makeRequest',
  makeRequest,
  'use',
) as WithParsedExtension<typeof makeRequest, {
  makeRequest<C extends {}, E extends {}>(
    this: Action<C, E>,
    pathOrBaseURL: string,
    config?: HttpRequestConfig,
  ): Action<C, E>;
}>;
