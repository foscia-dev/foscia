import MapRegistry from '@foscia/core/registry/mapRegistry';
import { MapRegistryConfig, MapRegistryModelsRegistration } from '@foscia/core/registry/types';

type RegistryConfig = Partial<MapRegistryConfig & {
  models: MapRegistryModelsRegistration;
}>;

export default function makeRegistry(config: RegistryConfig = {}) {
  const { models, ...realConfig } = config;
  const registry = new MapRegistry(realConfig);
  if (models) {
    registry.register(models);
  }

  return { registry };
}
