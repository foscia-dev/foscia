import makeRefsCache from '@foscia/core/cache/makeRefsCache';
import { RefsCacheConfig } from '@foscia/core/cache/types';
import weakRefManager from '@foscia/core/cache/weakRefManager';

type CacheConfig = Partial<RefsCacheConfig>;

export default function makeCache(config: CacheConfig = {}) {
  const cache = makeRefsCache({
    manager: weakRefManager,
    ...config,
  });

  return { cache };
}
