import { RefsCacheConfig, RefValue } from '@foscia/core/cache/types';
import { primaryValues } from '@foscia/core/models/index';
import {
  Model,
  ModelInstance,
  ModelPrimaryDictionary,
  ModelPrimaryType,
} from '@foscia/core/models/types';
import { InstancesCache } from '@foscia/core/types';
import { Dictionary, makeMultimap, Multimap } from '@foscia/shared';

/**
 * Make a cache using a {@link RefFactory | `RefFactory`} to store cached
 * instances inside {@link RefValue | `RefValue`}.
 *
 * @param config
 *
 * @category Factories
 */
export default function makeRefsCache(config: RefsCacheConfig): InstancesCache {
  type RefsCacheMultimap =
    Multimap<Dictionary<Model> | ModelPrimaryDictionary, RefValue<ModelInstance>>;

  const normalizeKey = (
    model: Model,
    primary: ModelPrimaryType | ModelPrimaryDictionary,
  ) => ({
    $model: model,
    ...(typeof primary === 'object' ? primary : { id: primary }),
  });

  const instances: RefsCacheMultimap = makeMultimap();

  return {
    get: async (model, primary) => {
      const key = normalizeKey(model, primary);
      const ref = instances.get(key);
      if (ref) {
        const instance = await ref();
        if (instance) {
          return instance;
        }

        instances.delete(key);
      }

      return undefined;
    },
    set: async (instance) => instances.set(
      normalizeKey(instance.$model, primaryValues(instance)),
      await config.makeRef(instance),
    ),
    delete: async (model, primary) => instances.delete(normalizeKey(model, primary)),
  };
}
