import makeRefsCacheWith from '@foscia/core/cache/makeRefsCacheWith';
import { RefsCacheConfig } from '@foscia/core/cache/types';
import weakRefManager from '@foscia/core/cache/weakRefManager';

type CacheConfig = Partial<RefsCacheConfig>;

export default (config: CacheConfig = {}) => ({
  cache: makeRefsCacheWith({
    manager: weakRefManager,
    normalizeId: (id) => String(id),
    ...config,
  }),
});
