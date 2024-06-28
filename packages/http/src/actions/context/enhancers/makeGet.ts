import { Action, appendExtension, WithParsedExtension } from '@foscia/core';
import makeRequest from '@foscia/http/actions/context/enhancers/makeRequest';
import { HttpRequestConfig } from '@foscia/http/types';

/**
 * HTTP GET method shortcut for the {@link makeRequest} function.
 *
 * @param pathOrBaseURL
 * @param config
 *
 * @category Enhancers
 */
const makeGet = (
  pathOrBaseURL: string,
  config?: Omit<HttpRequestConfig, 'method' | 'body'>,
) => makeRequest(pathOrBaseURL, {
  method: 'GET',
  ...config,
});

export default /* @__PURE__ */ appendExtension(
  'makeGet',
  makeGet,
  'use',
) as WithParsedExtension<typeof makeGet, {
  makeGet<C extends {}, E extends {}>(
    this: Action<C, E>,
    pathOrBaseURL: string,
    config?: Omit<HttpRequestConfig, 'method' | 'body'>,
  ): Action<C, E>;
}>;
