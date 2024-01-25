import makeMapRegistry from '@foscia/core/registry/makeMapRegistry';
import { MapRegistryConfig, MapRegistryModelsRegistration } from '@foscia/core/registry/types';

type RegistryConfig = Partial<MapRegistryConfig>;

export default function makeRegistry(
  models: MapRegistryModelsRegistration,
  config: RegistryConfig = {},
) {
  const registry = makeMapRegistry(config);

  registry.register(models);

  return { registry };
}
