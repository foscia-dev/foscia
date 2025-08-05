import makeContextConsumer from '@foscia/core/actions/context/consumers/makeContextConsumer';
import { ConsumeModelInstance } from '@foscia/core/actions/types';

/**
 * Retrieve the instance from a context.
 *
 * @param context
 * @param defaultValue
 */
export default /* @__PURE__ */ makeContextConsumer<'instance', ConsumeModelInstance>('instance');
