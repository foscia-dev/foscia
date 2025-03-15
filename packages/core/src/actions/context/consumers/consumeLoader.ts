import makeContextConsumer from '@foscia/core/actions/context/consumers/makeContextConsumer';
import { ConsumeLoader } from '@foscia/core/actions/types';

/**
 * Retrieve the relations loader from a context.
 *
 * @param context
 * @param defaultValue
 */
export default /* @__PURE__ */ makeContextConsumer<'loader', ConsumeLoader>('loader');
