import makeContextConsumer from '@foscia/core/actions/context/consumers/makeContextConsumer';
import { ConsumeRegistry } from '@foscia/core/actions/types';

/**
 * Retrieve the registry from a context.
 *
 * @param context
 * @param defaultValue
 */
export default /* @__PURE__ */ makeContextConsumer<'registry', ConsumeRegistry>('registry');
