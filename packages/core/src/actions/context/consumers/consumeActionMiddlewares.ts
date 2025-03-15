import makeContextConsumer from '@foscia/core/actions/context/consumers/makeContextConsumer';
import { ConsumeActionMiddlewares } from '@foscia/core/actions/types';

/**
 * Retrieve the action's middlewares from a context.
 *
 * @param context
 * @param defaultValue
 *
 * @internal
 */
export default /* @__PURE__ */ makeContextConsumer<'middlewares', ConsumeActionMiddlewares>('middlewares');
