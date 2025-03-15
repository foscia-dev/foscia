import makeContextConsumer from '@foscia/core/actions/context/consumers/makeContextConsumer';
import { ConsumeCache } from '@foscia/core/actions/types';

/**
 * Retrieve the cache from a context.
 *
 * @param context
 * @param defaultValue
 */
export default /* @__PURE__ */ makeContextConsumer<'cache', ConsumeCache>('cache');
