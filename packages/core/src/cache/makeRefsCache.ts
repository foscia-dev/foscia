import { RefsCacheConfig } from '@foscia/core/cache/types';
import { ModelIdType, ModelInstance } from '@foscia/core/model/types';
import { IdentifiersMap } from '@foscia/shared';

/**
 * Create a {@link CacheI} implementation interacting with instance references
 * through configured {@link RefsManager}.
 *
 * @param config
 */
export default function makeRefsCache(config: RefsCacheConfig) {
  const instances = new IdentifiersMap<string, ModelIdType, unknown>();

  const forget = async (type: string, id: ModelIdType) => {
    instances.delete(type, id);
  };

  const forgetAll = async (type: string) => {
    instances.deleteAll(type);
  };

  const clear = async () => {
    instances.clear();
  };

  const find = async (type: string, id: ModelIdType) => {
    const ref = instances.get(type, id);
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
    instances.set(type, id, await config.manager.ref(instance));
  };

  return {
    forget,
    forgetAll,
    clear,
    find,
    put,
  };
}
