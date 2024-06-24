import { Action, appendExtension, WithParsedExtension } from '@foscia/core';
import makeRequest from '@foscia/http/actions/context/enhancers/makeRequest';
import { HttpRequestConfig } from '@foscia/http/types';

/**
 * HTTP PATCH method shortcut for the {@link makeRequest} function.
 *
 * @param pathOrBaseURL
 * @param body
 * @param config
 *
 * @category Enhancers
 */
function makePatch(
  pathOrBaseURL: string,
  body?: HttpRequestConfig['body'],
  config?: Omit<HttpRequestConfig, 'method' | 'body'>,
) {
  return makeRequest(pathOrBaseURL, {
    method: 'PATCH',
    body,
    ...config,
  });
}

export default /* @__PURE__ */ appendExtension(
  'makePatch',
  makePatch,
  'use',
) as WithParsedExtension<typeof makePatch, {
  makePatch<C extends {}, E extends {}>(
    this: Action<C, E>,
    pathOrBaseURL: string,
    body?: HttpRequestConfig['body'],
    config?: Omit<HttpRequestConfig, 'method' | 'body'>,
  ): Action<C, E>;
}>;
