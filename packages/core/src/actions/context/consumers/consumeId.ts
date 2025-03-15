import makeContextConsumer from '@foscia/core/actions/context/consumers/makeContextConsumer';
import { ConsumeId } from '@foscia/core/actions/types';

/**
 * Retrieve the record ID from a context.
 *
 * @param context
 * @param defaultValue
 */
export default /* @__PURE__ */ makeContextConsumer<'id', ConsumeId>('id');
