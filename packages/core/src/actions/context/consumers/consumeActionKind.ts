import makeContextConsumer from '@foscia/core/actions/context/consumers/makeContextConsumer';
import { ConsumeActionKind } from '@foscia/core/actions/types';

/**
 * Retrieve the action kind from a context.
 *
 * @param context
 * @param defaultValue
 */
export default /* @__PURE__ */ makeContextConsumer<'actionKind', ConsumeActionKind>('actionKind');
