import MapRegistry from '@foscia/core/registry/mapRegistry';
import { MapRegistryConfig, MapRegistryModelsRegistration } from '@foscia/core/registry/types';

type RegistryConfig = Partial<MapRegistryConfig>;

export default function makeRegistry(
  models: MapRegistryModelsRegistration,
  config: RegistryConfig = {},
) {
  const registry = new MapRegistry(config);

  registry.register(models);

  return { registry };
}
