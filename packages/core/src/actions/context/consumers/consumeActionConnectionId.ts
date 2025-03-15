import makeContextConsumer from '@foscia/core/actions/context/consumers/makeContextConsumer';
import { ConsumeActionConnectionId } from '@foscia/core/actions/types';

/**
 * Retrieve the action connection ID from a context.
 *
 * @param context
 * @param defaultValue
 */
export default /* @__PURE__ */ makeContextConsumer<'actionConnectionId', ConsumeActionConnectionId>('actionConnectionId');
