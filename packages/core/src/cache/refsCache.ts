import { RefsCacheConfig } from '@foscia/core/cache/types';
import { ModelIdType, ModelInstance } from '@foscia/core/model/types';
import { CacheI } from '@foscia/core/types';
import { IdentifiersMap, makeConfigurable } from '@foscia/shared';

/**
 * @deprecated Use {@link makeRefsCache}.
 */
export default class RefsCache implements CacheI {
  declare public readonly $config: RefsCacheConfig;

  declare public configure: (config: Partial<RefsCacheConfig>, override?: boolean) => this;

  private readonly instances: IdentifiersMap<string, ModelIdType, unknown>;

  public constructor(config: RefsCacheConfig) {
    this.instances = new IdentifiersMap();

    makeConfigurable(this, config);
  }

  public async find(type: string, id: ModelIdType) {
    const ref = this.instances.get(type, id);
    if (!ref) {
      return null;
    }

    const instance = await this.$config.manager.value(ref);
    if (!instance) {
      await this.forget(type, id);

      return null;
    }

    return instance;
  }

  public async put(type: string, id: ModelIdType, instance: ModelInstance) {
    this.instances.set(type, id, await this.$config.manager.ref(instance));
  }

  public async forget(type: string, id: ModelIdType) {
    this.instances.delete(type, id);
  }

  public async forgetAll(type: string) {
    this.instances.deleteAll(type);
  }

  public async clear() {
    this.instances.clear();
  }
}
