import makeRefsCache from '@foscia/core/cache/makeRefsCache';
import makeWeakRefManager from '@foscia/core/cache/makeWeakRefManager';
import { CacheI } from '@foscia/core/types';
import { toKebabCase } from '@foscia/shared';

/**
 * Make a default {@link CacheI | `CacheI`} implementation.
 *
 * @category Factories
 */
export default (): { cache: CacheI; } => makeRefsCache({
  manager: makeWeakRefManager(),
  normalizeType: toKebabCase,
  normalizeId: (id) => String(id),
});
