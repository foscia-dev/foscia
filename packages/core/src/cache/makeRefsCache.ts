import { RefsCache, RefsCacheConfig, RefValue } from '@foscia/core/cache/types';
import { ModelIdType, ModelInstance } from '@foscia/core/model/types';
import { makeIdentifiersMap } from '@foscia/shared';

/**
 * Make a cache using a {@link RefFactory | `RefFactory`} to store cached
 * instances inside {@link RefValue | `RefValue`}.
 *
 * @param config
 *
 * @category Factories
 */
export default (config: RefsCacheConfig) => {
  const instances = makeIdentifiersMap<string, ModelIdType, RefValue<ModelInstance>>();

  const normalizeType = config.normalizeType ?? ((t) => t);
  const normalizeId = config.normalizeId ?? ((v) => v);

  const forget = async (type: string, id: ModelIdType) => instances.forget(
    normalizeType(type),
    normalizeId(id),
  );

  return {
    cache: {
      forget,
      forgetAll: async (type: string) => instances.forgetAll(normalizeType(type)),
      clear: async () => instances.clear(),
      find: async (type: string, id: ModelIdType) => {
        const ref = instances.find(normalizeType(type), normalizeId(id));
        if (ref) {
          const instance = await ref();
          if (instance) {
            return instance;
          }

          await forget(normalizeType(type), normalizeId(id));
        }

        return null;
      },
      put: async (type: string, id: ModelIdType, instance: ModelInstance) => instances.put(
        normalizeType(type),
        normalizeId(id),
        await config.makeRef(instance),
      ),
    } as RefsCache,
  };
};
