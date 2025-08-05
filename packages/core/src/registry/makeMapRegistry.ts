import parseConnectionType from '@foscia/core/connections/parseConnectionType';
import { Model } from '@foscia/core/models/types';
import { ModelRegistry } from '@foscia/core/types';
import { Dictionary, makeMultimap } from '@foscia/shared';

/**
 * Make a registry holding models in a map.
 *
 * @category Factories
 */
export default function makeMapRegistry(): ModelRegistry {
  const normalizeKey = (type: string) => {
    const connectionType = parseConnectionType(type);

    return {
      $connection: connectionType.connection,
      $type: connectionType.type,
    };
  };

  const instances = makeMultimap<Dictionary<string>, Model>();

  return {
    get: async (type) => instances.get(normalizeKey(type)),
    set: async (model) => instances.set({
      $connection: model.$connection,
      $type: model.$type,
    }, model),
  };
}
