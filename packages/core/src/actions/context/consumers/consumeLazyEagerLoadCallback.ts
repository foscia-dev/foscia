import makeContextConsumer from '@foscia/core/actions/context/consumers/makeContextConsumer';
import { ConsumeLazyEagerLoadCallback } from '@foscia/core/actions/types';

/**
 * Retrieve the lazy eager load callback from a context.
 *
 * @param context
 * @param defaultValue
 */
export default /* @__PURE__ */ makeContextConsumer<'lazyEagerLoadCallback', ConsumeLazyEagerLoadCallback>(
  'lazyEagerLoadCallback',
);
