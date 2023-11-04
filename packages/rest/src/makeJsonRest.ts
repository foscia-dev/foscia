import { context, makeActionClass, MapRegistry, RefsCache } from '@foscia/core';
import { bodyAsJson } from '@foscia/http';
import RestAdapter from '@foscia/rest/restAdapter';
import RestDeserializer from '@foscia/rest/restDeserializer';
import RestSerializer from '@foscia/rest/restSerializer';
import { JsonRestConfig } from '@foscia/rest/types';
import { toKebabCase } from '@foscia/shared';
import { makeActionFactoryMockable } from '@foscia/test';

/**
 * Create a JSON REST action factory.
 *
 * @param config
 */
export default function makeJsonRest<Extension extends {} = {}>(
  config: JsonRestConfig<Extension> = {},
) {
  const cache = new RefsCache(config.cache);

  const registry = new MapRegistry({
    normalizeType: toKebabCase,
    ...config.registry,
  });
  if (config.models) {
    registry.register(config.models);
  }

  const adapter = new RestAdapter({
    baseURL: '/api',
    defaultBodyAs: bodyAsJson,
    defaultHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...config.http?.defaultHeaders,
    },
    ...config.http,
  });

  const deserializer = new RestDeserializer({
    dataReader: (response) => (
      response.status === 204 ? undefined : response.json()
    ),
    ...config.deserializer,
  });
  const serializer = new RestSerializer(config.serializer);

  const Action = makeActionClass(config.extensions);
  const withDependencies = context({ cache, registry, adapter, deserializer, serializer });

  return {
    cache,
    registry,
    adapter,
    deserializer,
    serializer,
    withDependencies,
    Action,
    action: makeActionFactoryMockable(() => new Action().use(withDependencies)),
  };
}
