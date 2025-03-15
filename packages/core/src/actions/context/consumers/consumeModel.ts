import makeContextConsumer from '@foscia/core/actions/context/consumers/makeContextConsumer';
import { ConsumeModel } from '@foscia/core/actions/types';

/**
 * Retrieve the model from a context.
 *
 * @param context
 * @param defaultValue
 */
export default /* @__PURE__ */ makeContextConsumer<'model', ConsumeModel>('model');
