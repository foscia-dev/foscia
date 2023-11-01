import { Action, ActionParsedExtension, makeEnhancersExtension } from '@foscia/core';
import configureRequest from '@foscia/http/actions/context/enhancers/configureRequest';
import { HttpRequestConfig } from '@foscia/http/types';

function decomposeURL(pathOrBaseURL: string) {
  if (/^(\/|(https?|s?ftp):)/.test(pathOrBaseURL)) {
    return { baseURL: pathOrBaseURL };
  }

  return { path: pathOrBaseURL };
}

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
export default function makeRequest(
  pathOrBaseURL: string,
  config?: HttpRequestConfig,
) {
  return configureRequest({ ...decomposeURL(pathOrBaseURL), ...config });
}

type MakeRequestEnhancerExtension = ActionParsedExtension<{
  makeRequest<C extends {}, E extends {}>(
    this: Action<C, E>,
    pathOrBaseURL: string,
    config?: HttpRequestConfig,
  ): Action<C, E>;
}>;

makeRequest.extension = makeEnhancersExtension({ makeRequest }) as MakeRequestEnhancerExtension;
