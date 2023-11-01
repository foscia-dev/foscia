import { context, makeActionClass, MapRegistry, RefsCache } from '@foscia/core';
import { bodyAsJson, deepParamsSerializer } from '@foscia/http';
import JsonApiAdapter from '@foscia/jsonapi/jsonApiAdapter';
import JsonApiDeserializer from '@foscia/jsonapi/jsonApiDeserializer';
import JsonApiSerializer from '@foscia/jsonapi/jsonApiSerializer';
import { JsonApiConfig } from '@foscia/jsonapi/types';
import { toKebabCase } from '@foscia/shared';
import { makeActionFactoryMockable } from '@foscia/test';

/**
 * Create a JSON:API action factory.
 *
 * @param config
 */
export default function makeJsonApi<Extension extends {} = {}>(
  config: JsonApiConfig<Extension> = {},
) {
  const cache = new RefsCache(config.cache);

  const registry = new MapRegistry({
    normalizeType: toKebabCase,
    ...config.registry,
  });
  if (config.models) {
    registry.register(config.models);
  }

  const adapter = new JsonApiAdapter({
    baseURL: '/api/v1',
    serializeParams: deepParamsSerializer,
    defaultBodyAs: bodyAsJson,
    defaultHeaders: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      ...config.http?.defaultHeaders,
    },
    ...config.http,
  });

  const deserializer = new JsonApiDeserializer();
  const serializer = new JsonApiSerializer();

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
