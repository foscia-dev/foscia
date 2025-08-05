import makeRefsCache from '@foscia/core/cache/makeRefsCache';
import makeWeakRefFactory from '@foscia/core/cache/makeWeakRefFactory';
import { InstancesCache } from '@foscia/core/types';

/**
 * Make a default {@link InstancesCache | `InstancesCache`} implementation.
 *
 * @category Factories
 */
export default function makeCache(): InstancesCache {
  return makeRefsCache({
    makeRef: makeWeakRefFactory(),
  });
}
