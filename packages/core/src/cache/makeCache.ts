import makeRefsCache from '@foscia/core/cache/makeRefsCache';
import makeWeakRefManager from '@foscia/core/cache/makeWeakRefManager';
import { InstancesCache } from '@foscia/core/types';
import { kebabCase } from '@foscia/shared';

/**
 * Make a default {@link InstancesCache | `InstancesCache`} implementation.
 *
 * @category Factories
 */
export default (): { cache: InstancesCache; } => makeRefsCache({
  manager: makeWeakRefManager(),
  normalizeType: kebabCase,
  normalizeId: (id) => String(id),
});
