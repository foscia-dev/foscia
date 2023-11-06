import RefsCache from '@foscia/core/cache/refsCache';
import { RefsCacheConfig } from '@foscia/core/cache/types';
import weakRefManager from '@foscia/core/cache/weakRefManager';

type CacheConfig = Partial<RefsCacheConfig>;

export default function makeCache(config: CacheConfig = {}) {
  const cache = new RefsCache({
    manager: weakRefManager,
    ...config,
  });

  return { cache };
}
