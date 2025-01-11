import { MapRegistry, MapRegistryConfig } from '@foscia/core/registry/types';

/**
 * Make a registry which holds registered models in a map.
 *
 * @param config
 *
 * @category Factories
 */
export default (config: MapRegistryConfig) => {
  const normalizeType = config.normalizeType ?? ((t) => t);

  const modelsMap = new Map((config.models ?? []).map((model) => [
    normalizeType(model.$type), model,
  ]));

  return {
    registry: {
      modelFor: async (type: string) => modelsMap.get(normalizeType(type)) ?? null,
    } as MapRegistry,
  };
};
