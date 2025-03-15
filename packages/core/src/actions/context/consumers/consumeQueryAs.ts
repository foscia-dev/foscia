import makeContextConsumer from '@foscia/core/actions/context/consumers/makeContextConsumer';
import { ConsumeQueryAs } from '@foscia/core/actions/types';

/**
 * Retrieve the "query as" models from a context.
 *
 * @param context
 * @param defaultValue
 */
export default /* @__PURE__ */ makeContextConsumer<'queryAs', ConsumeQueryAs>('queryAs');
