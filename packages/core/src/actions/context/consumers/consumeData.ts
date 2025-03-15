import makeContextConsumer from '@foscia/core/actions/context/consumers/makeContextConsumer';
import { ConsumeData } from '@foscia/core/actions/types';

/**
 * Retrieve the data from a context.
 *
 * @param context
 * @param defaultValue
 */
export default /* @__PURE__ */ makeContextConsumer<'data', ConsumeData>('data');
