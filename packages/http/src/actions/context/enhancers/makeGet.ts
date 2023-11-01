import { Action, ActionParsedExtension, makeEnhancersExtension } from '@foscia/core';
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
export default function makeGet(
  pathOrBaseURL: string,
  config?: Omit<HttpRequestConfig, 'method' | 'body'>,
) {
  return makeRequest(pathOrBaseURL, {
    method: 'GET',
    ...config,
  });
}

type MakeGetEnhancerExtension = ActionParsedExtension<{
  makeGet<C extends {}, E extends {}>(
    this: Action<C, E>,
    pathOrBaseURL: string,
    config?: Omit<HttpRequestConfig, 'method' | 'body'>,
  ): Action<C, E>;
}>;

makeGet.extension = makeEnhancersExtension({ makeGet }) as MakeGetEnhancerExtension;
