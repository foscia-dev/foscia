import { RefsCache, RefsCacheConfig } from '@foscia/core/cache/types';
import { ModelIdType, ModelInstance } from '@foscia/core/model/types';
import { makeIdentifiersMap } from '@foscia/shared';

/**
 * Make a cache interacting with instance references
 * through configured {@link RefsManager | `RefsManager`}.
 *
 * @param config
 *
 * @category Factories
 */
export default (config: RefsCacheConfig) => {
  const instances = makeIdentifiersMap<string, ModelIdType, unknown>();

  const normalizeType = config.normalizeType ?? ((t) => t);
  const normalizeId = config.normalizeId ?? ((v) => v);

  const forget = async (type: string, id: ModelIdType) => instances.forget(
    normalizeType(type),
    normalizeId(id),
  );

  const forgetAll = async (type: string) => instances.forgetAll(normalizeType(type));

  const clear = async () => instances.clear();

  const find = async (type: string, id: ModelIdType) => {
    const ref = instances.find(normalizeType(type), normalizeId(id));
    if (ref) {
      const instance = await config.manager.value(ref);
      if (instance) {
        return instance;
      }

      await forget(normalizeType(type), normalizeId(id));
    }

    return null;
  };

  const put = async (type: string, id: ModelIdType, instance: ModelInstance) => instances.put(
    normalizeType(type),
    normalizeId(id),
    await config.manager.ref(instance),
  );

  return {
    cache: {
      forget,
      forgetAll,
      clear,
      find,
      put,
    } as RefsCache,
  };
};
