import parseConnectionType from '@foscia/core/connections/parseConnectionType';
import { Model } from '@foscia/core/model/types';
import { MapRegistry, MapRegistryConfig } from '@foscia/core/registry/types';
import { Multimap, multimapGet, multimapSet } from '@foscia/shared';

/**
 * Make a registry which holds registered models in a map.
 *
 * @param config
 *
 * @category Factories
 */
export default (config: MapRegistryConfig): { registry: MapRegistry; } => {
  const models: Multimap<[string, string], Model> = new Map();

  const normalizeType = config.normalizeType ?? ((t) => t);
  const parseRawType = (rawType: string) => {
    const [connection, type] = parseConnectionType(rawType);

    return [connection, normalizeType(type)] as const;
  };

  config.models?.forEach((model) => {
    multimapSet(models, [model.$connection, normalizeType(model.$type)], model);
  });

  return {
    registry: {
      resolve: async (rawType) => multimapGet(models, parseRawType(rawType)) ?? null,
    },
  };
};
