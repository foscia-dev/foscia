import makeContextConsumer from '@foscia/core/actions/context/consumers/makeContextConsumer';
import { ConsumeAdapter } from '@foscia/core/actions/types';

/**
 * Retrieve the adapter from a context.
 *
 * @param context
 * @param defaultValue
 */
export default /* @__PURE__ */ makeContextConsumer<'adapter', ConsumeAdapter>('adapter');
