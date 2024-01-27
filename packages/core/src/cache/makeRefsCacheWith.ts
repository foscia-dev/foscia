import { RefsCache, RefsCacheConfig } from '@foscia/core/cache/types';
import { ModelIdType, ModelInstance } from '@foscia/core/model/types';
import { makeIdentifiersMap } from '@foscia/shared';

/**
 * Make a {@link CacheI} implementation interacting with instance references
 * through configured {@link RefsManager}.
 *
 * @param config
 */
export default function makeRefsCacheWith(config: RefsCacheConfig): RefsCache {
  const instances = makeIdentifiersMap<string, ModelIdType, unknown>();

  const forget = async (type: string, id: ModelIdType) => instances.forget(type, id);

  const forgetAll = async (type: string) => instances.forgetAll(type);

  const clear = async () => instances.clear();

  const find = async (type: string, id: ModelIdType) => {
    const ref = instances.find(type, id);
    if (!ref) {
      return null;
    }

    const instance = await config.manager.value(ref);
    if (!instance) {
      await forget(type, id);

      return null;
    }

    return instance;
  };

  const put = async (type: string, id: ModelIdType, instance: ModelInstance) => {
    instances.put(type, id, await config.manager.ref(instance));
  };

  return {
    forget,
    forgetAll,
    clear,
    find,
    put,
  };
}
