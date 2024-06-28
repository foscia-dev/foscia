import { Action, appendExtension, WithParsedExtension } from '@foscia/core';
import makeRequest from '@foscia/http/actions/context/enhancers/makeRequest';
import { HttpRequestConfig } from '@foscia/http/types';

/**
 * HTTP POST method shortcut for the {@link makeRequest} function.
 *
 * @param pathOrBaseURL
 * @param body
 * @param config
 *
 * @category Enhancers
 */
const makePost = (
  pathOrBaseURL: string,
  body?: HttpRequestConfig['body'],
  config?: Omit<HttpRequestConfig, 'method' | 'body'>,
) => makeRequest(pathOrBaseURL, {
  method: 'POST',
  body,
  ...config,
});

export default /* @__PURE__ */ appendExtension(
  'makePost',
  makePost,
  'use',
) as WithParsedExtension<typeof makePost, {
  makePost<C extends {}, E extends {}>(
    this: Action<C, E>,
    pathOrBaseURL: string,
    body?: HttpRequestConfig['body'],
    config?: Omit<HttpRequestConfig, 'method' | 'body'>,
  ): Action<C, E>;
}>;
