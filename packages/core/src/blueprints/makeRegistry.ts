import makeMapRegistryWith from '@foscia/core/registry/makeMapRegistryWith';
import { MapRegistryConfig, MapRegistryModelsRegistration } from '@foscia/core/registry/types';

type RegistryConfig = Partial<MapRegistryConfig>;

export default function makeRegistry(
  models: MapRegistryModelsRegistration,
  config: RegistryConfig = {},
) {
  const registry = makeMapRegistryWith(config);

  registry.register(models);

  return { registry };
}
