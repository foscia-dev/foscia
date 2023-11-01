import { context, makeActionClass } from '@foscia/core';
import HttpAdapter from '@foscia/http/httpAdapter';
import { HttpClientConfig } from '@foscia/http/types';
import { makeActionFactoryMockable } from '@foscia/test';

/**
 * Create an HTTP client action factory.
 *
 * @param config
 */
export default function makeHttpClient<Extension extends {} = {}>(
  config: HttpClientConfig<Extension> = {},
) {
  const adapter = new HttpAdapter({
    baseURL: '/',
    ...config.http,
  });

  const Action = makeActionClass(config.extensions);
  const withDependencies = context({ adapter });

  return {
    adapter,
    withDependencies,
    Action,
    action: makeActionFactoryMockable(() => new Action().use(withDependencies)),
  };
}
