import makeRefsCache from '@foscia/core/cache/makeRefsCache';
import makeWeakRefFactory from '@foscia/core/cache/makeWeakRefFactory';
import { InstancesCache } from '@foscia/core/types';
import { kebabCase } from '@foscia/shared';

/**
 * Make a default {@link InstancesCache | `InstancesCache`} implementation.
 *
 * @category Factories
 */
export default (): { cache: InstancesCache; } => makeRefsCache({
  makeRef: makeWeakRefFactory(),
  normalizeType: kebabCase,
  normalizeId: (id) => String(id),
});
