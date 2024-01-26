import makeRefsCacheWith from '@foscia/core/cache/makeRefsCacheWith';
import { RefsCacheConfig } from '@foscia/core/cache/types';
import weakRefManager from '@foscia/core/cache/weakRefManager';

type CacheConfig = Partial<RefsCacheConfig>;

export default function makeCache(config: CacheConfig = {}) {
  const cache = makeRefsCacheWith({
    manager: weakRefManager,
    ...config,
  });

  return { cache };
}
